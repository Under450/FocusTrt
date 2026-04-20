import { NextRequest, NextResponse } from "next/server";

type SearchResult = {
  title: string;
  authors: string;
  abstract: string;
  doi: string | null;
  year: number | null;
  url: string | null;
  source: "semantic_scholar" | "pubmed";
};

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 3) {
    return NextResponse.json({ results: [], error: "Query too short" });
  }

  const [s2Results, pmResults] = await Promise.allSettled([
    searchSemanticScholar(query),
    searchPubMed(query),
  ]);

  const results: SearchResult[] = [];

  if (s2Results.status === "fulfilled") results.push(...s2Results.value);
  if (pmResults.status === "fulfilled") results.push(...pmResults.value);

  // Deduplicate by DOI
  const seen = new Set<string>();
  const deduped = results.filter((r) => {
    if (!r.doi) return true;
    const key = r.doi.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json({ results: deduped });
}

// --- Semantic Scholar ---

async function searchSemanticScholar(query: string): Promise<SearchResult[]> {
  const url = new URL("https://api.semanticscholar.org/graph/v1/paper/search");
  url.searchParams.set("query", query);
  url.searchParams.set("limit", "10");
  url.searchParams.set("fields", "title,authors,abstract,externalIds,year,url");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "FocusTRT/1.0" },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) return [];

  const json = await res.json();
  if (!json.data) return [];

  return json.data
    .filter((p: any) => p.title && p.abstract)
    .map((p: any) => ({
      title: p.title,
      authors: (p.authors || []).map((a: any) => a.name).join(", "),
      abstract: p.abstract,
      doi: p.externalIds?.DOI || null,
      year: p.year || null,
      url: p.url || null,
      source: "semantic_scholar" as const,
    }));
}

// --- PubMed ---

async function searchPubMed(query: string): Promise<SearchResult[]> {
  // Step 1: search for IDs
  const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
  searchUrl.searchParams.set("db", "pubmed");
  searchUrl.searchParams.set("term", query);
  searchUrl.searchParams.set("retmax", "10");
  searchUrl.searchParams.set("retmode", "json");

  const searchRes = await fetch(searchUrl.toString(), {
    signal: AbortSignal.timeout(8000),
  });
  if (!searchRes.ok) return [];

  const searchJson = await searchRes.json();
  const ids: string[] = searchJson.esearchresult?.idlist || [];
  if (ids.length === 0) return [];

  // Step 2: fetch details
  const fetchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi");
  fetchUrl.searchParams.set("db", "pubmed");
  fetchUrl.searchParams.set("id", ids.join(","));
  fetchUrl.searchParams.set("retmode", "json");

  const detailRes = await fetch(fetchUrl.toString(), {
    signal: AbortSignal.timeout(8000),
  });
  if (!detailRes.ok) return [];

  const detailJson = await detailRes.json();

  // Step 3: fetch abstracts via efetch
  const abstractUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi");
  abstractUrl.searchParams.set("db", "pubmed");
  abstractUrl.searchParams.set("id", ids.join(","));
  abstractUrl.searchParams.set("rettype", "abstract");
  abstractUrl.searchParams.set("retmode", "xml");

  const abstractRes = await fetch(abstractUrl.toString(), {
    signal: AbortSignal.timeout(8000),
  });

  let abstractMap: Record<string, string> = {};
  if (abstractRes.ok) {
    const xml = await abstractRes.text();
    abstractMap = parseAbstractsFromXml(xml);
  }

  const results: SearchResult[] = [];

  for (const id of ids) {
    const item = detailJson.result?.[id];
    if (!item || !item.title) continue;

    const authors = (item.authors || [])
      .map((a: any) => a.name)
      .join(", ");

    const doi = (item.articleids || []).find(
      (a: any) => a.idtype === "doi"
    )?.value || null;

    results.push({
      title: item.title,
      authors,
      abstract: abstractMap[id] || "",
      doi,
      year: item.pubdate ? parseInt(item.pubdate) || null : null,
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      source: "pubmed",
    });
  }

  return results;
}

function parseAbstractsFromXml(xml: string): Record<string, string> {
  const map: Record<string, string> = {};
  const articles = xml.split("<PubmedArticle>");

  for (const article of articles) {
    const pmidMatch = article.match(/<PMID[^>]*>(\d+)<\/PMID>/);
    const abstractMatch = article.match(
      /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g
    );

    if (pmidMatch && abstractMatch) {
      const text = abstractMatch
        .map((m) => m.replace(/<[^>]+>/g, "").trim())
        .join(" ");
      map[pmidMatch[1]] = text;
    }
  }

  return map;
}
