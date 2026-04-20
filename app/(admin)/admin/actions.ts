"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CreateStudyResult =
  | { ok: true; studyId: string }
  | { ok: false; error: string };

/**
 * Create a new study record.
 * Accepts text paste, PDF upload, or URL.
 * RLS ensures only admins can insert.
 */
export async function createStudy(
  formData: FormData
): Promise<CreateStudyResult> {
  const supabase = await createClient();

  // Verify user is authed (middleware also checks but belt-and-braces)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Not authenticated" };
  }

  const title = String(formData.get("title") ?? "").trim();
  const sourceType = String(formData.get("source_type") ?? "").trim();
  const sourceText = String(formData.get("source_text") ?? "").trim();
  const sourceUrl = String(formData.get("source_url") ?? "").trim();
  const doi = String(formData.get("doi") ?? "").trim() || null;
  const citation = String(formData.get("citation") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const file = formData.get("source_file") as File | null;

  // Validation
  if (!title) return { ok: false, error: "Title is required" };
  if (!["text", "pdf", "url"].includes(sourceType)) {
    return { ok: false, error: "Invalid source type" };
  }

  let sourceFilePath: string | null = null;

  if (sourceType === "text" && !sourceText) {
    return { ok: false, error: "Paste the study text" };
  }
  if (sourceType === "url" && !sourceUrl) {
    return { ok: false, error: "Enter the study URL" };
  }
  if (sourceType === "pdf") {
    if (!file || file.size === 0) {
      return { ok: false, error: "Upload a PDF or TXT file" };
    }
    if (file.size > 25 * 1024 * 1024) {
      return { ok: false, error: "File exceeds 25MB limit" };
    }
    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(file.type)) {
      return { ok: false, error: "Only PDF and TXT files are allowed" };
    }

    // Upload to Supabase Storage
    const ext = file.type === "application/pdf" ? "pdf" : "txt";
    const timestamp = Date.now();
    const safeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
    const path = `${user.id}/${timestamp}-${safeTitle}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("study-uploads")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { ok: false, error: `Upload failed: ${uploadError.message}` };
    }
    sourceFilePath = path;
  }

  // Insert DB row
  const { data, error } = await supabase
    .from("studies")
    .insert({
      title,
      source_type: sourceType,
      source_text: sourceType === "text" ? sourceText : null,
      source_file_path: sourceFilePath,
      source_url: sourceType === "url" ? sourceUrl : null,
      doi,
      citation,
      notes,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    // Clean up storage if DB insert failed
    if (sourceFilePath) {
      await supabase.storage.from("study-uploads").remove([sourceFilePath]);
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/studies");
  return { ok: true, studyId: data.id };
}

/**
 * Delete a study (and its uploaded file if any).
 * RLS ensures only admins can delete.
 */
export async function deleteStudy(studyId: string): Promise<void> {
  const supabase = await createClient();

  // Grab file path before deleting row
  const { data: study } = await supabase
    .from("studies")
    .select("source_file_path")
    .eq("id", studyId)
    .maybeSingle();

  const { error } = await supabase.from("studies").delete().eq("id", studyId);
  if (error) throw new Error(error.message);

  if (study?.source_file_path) {
    await supabase.storage
      .from("study-uploads")
      .remove([study.source_file_path]);
  }

  revalidatePath("/admin/studies");
  redirect("/admin/studies");
}

/**
 * Sign a URL for a privately-stored study file so admin can download.
 * URL expires in 5 minutes.
 */
export async function getSignedFileUrl(
  filePath: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("study-uploads")
    .createSignedUrl(filePath, 300);
  if (error) return null;
  return data.signedUrl;
}

/**
 * Sign out current user.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
