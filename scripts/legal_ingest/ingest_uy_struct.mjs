import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

const OUT_FILE = path.join(process.cwd(), "data", "legal", "uruguay");
const SOURCES = [
  {
    id: "constitucion_1967",
    url: "https://www.impo.com.uy/bases/constitucion/1967-1967"
  },
  {
    id: "codigo_civil_16603",
    url: "https://www.impo.com.uy/bases/codigo-civil/16603-1994"
  },
  {
    id: "codigo_penal_9155",
    url: "https://www.impo.com.uy/bases/codigo-penal/9155-1933"
  },
  {
    id: "codigo_comercio_817",
    url: "https://www.impo.com.uy/bases/codigo-comercio/817-1865"
  },
  {
    id: "codigo_aduanero_19276",
    url: "https://www.impo.com.uy/bases/codigo-aduanero/19276-2014"
  },
  {
    id: "decreto_36_2012",
    url: "https://www.impo.com.uy/bases/decretos/36-2012"
  },
  {
    id: "res_dgi_798_2012",
    url: "https://www.impo.com.uy/bases/resoluciones-dgi-interes-general/798-2012"
  },
  {
    id: "bps_textos_ordenados",
    url: "https://www.bps.gub.uy/3560/textos-ordenados.html"
  }
];

function htmlToStructuredText(html) {
  const doc = new JSDOM(html).window.document;

  // Preserve headings and paragraphs
  const selectors = ["h1", "h2", "h3", "h4", "p", "li"];
  const parts = [];

  selectors.forEach((sel) => {
    const elems = doc.querySelectorAll(sel);
    elems.forEach((e) => {
      const tag = e.tagName.toLowerCase();
      const txt = e.textContent.trim();
      if (!txt) return;
      if (tag.match(/^h[1-4]$/)) {
        parts.push("\n\n" + txt.toUpperCase() + "\n");
      } else if (tag === "li") {
        parts.push("  • " + txt + "\n");
      } else {
        parts.push(txt + "\n");
      }
    });
  });

  const text = parts.join("").replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

async function fetchAndConvert(url) {
  const res = await fetch(url);
  const html = await res.text();
  return htmlToStructuredText(html);
}

async function main() {
  const files = fs.readdirSync(OUT_FILE);
  const jsonFile = path.join(OUT_FILE, "uruguay_full.json");
  const j = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));

  for (const s of SOURCES) {
    console.log("Downloading:", s.id, s.url);
    try {
      const text = await fetchAndConvert(s.url);
      // insert into JSON in correct place
      for (const mod of j.modulos || []) {
        const it = (mod.items || []).find((x) => x.id === s.id);
        if (it) {
          it.texto_completo = text;
          break;
        }
      }
      console.log("-> OK:", s.id);
    } catch (e) {
      console.log("-> Error downloading", s.id, e.message || e);
    }
  }

  fs.writeFileSync(jsonFile, JSON.stringify(j, null, 2), "utf-8");
  console.log("All structured text ingestion complete!");
}

main();
