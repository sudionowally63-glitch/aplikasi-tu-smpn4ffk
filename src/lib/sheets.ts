async function safeFetchJson(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      if (text.trim().startsWith("<") || text.includes("<html") || text.includes("<HTML") || text.includes("The page")) {
        return { 
          error: "Server mengembalikan halaman HTML, bukan JSON. Ini biasanya terjadi jika server sedang memuat ulang, offline, atau jika URL Google Apps Script yang Anda masukkan salah / memerlukan login Google." 
        };
      }
      return { error: `Respon server bukan JSON yang valid: ${text.substring(0, 100)}` };
    }

    if (!response.ok) {
      return { error: data.error || `Server error (${response.status})` };
    }
    return data;
  } catch (err: any) {
    return { error: err.message || "Gagal menghubungi server proxy lokal." };
  }
}

export async function getData(key?: string) {
  const url = key ? `/api/sheets?key=${encodeURIComponent(key)}` : "/api/sheets";
  return await safeFetchJson(url);
}

export async function saveData(key: string, value: any) {
  return await safeFetchJson("/api/sheets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value })
  });
}

export async function getSheetsUrl() {
  const data = await safeFetchJson("/api/sheets/url");
  return data.url || "";
}

export async function saveSheetsUrl(url: string) {
  return await safeFetchJson("/api/sheets/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
}


