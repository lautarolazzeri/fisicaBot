const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const targetUrl = "https://api.tavily.com/search";

export async function searchWeb(query: string): Promise<string> {
  if (!query) return "";

  try {
    // Llamada a tu propio endpoint relativo
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error("Error en la búsqueda");

    const results = await res.json();
    let context = "";

    console.log("Resultados de Tavily:", results);

    if (results.answer) {
      context += `Resumen: ${results.answer}\n\n`;
    }

    if (results.results && Array.isArray(results.results)) {
      results.results.forEach((r: any, i: number) => {
        context += `FUENTE ${i + 1}:\n`;
        context += `TÍTULO: ${r.title}\n`;
        context += `URL: ${r.url}\n`;
        context += `CONTENIDO: ${r.content}\n\n`;
      });
    }

    return context;
  } catch (error) {
    console.error(error);
    return "";
  }
}
