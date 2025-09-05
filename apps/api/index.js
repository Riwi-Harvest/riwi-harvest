import cors from "cors";
import express from 'express';
import { runHipatia } from "../hipatia/src/index.js";
import bulkLoaderRoutes from "./routes/bulkLoaderRoutes.js";
import compositeRoutes from "./routes/compositeRoutes.js";
import generalRoutes from "./routes/generalRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// General (PK simple)
app.use("/api/general", generalRoutes);

// Composite (PK compuesta)
app.use("/api/composite", compositeRoutes);

// Upload CSVs
app.get("/vinagre", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let tries = 0;

  function send(data) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  async function vinagre() {
    try {
      tries += 1;
      send({ status: `Intento ${tries}`, step: "runHipatia" });

      const hipatiaRes = await runHipatia(send);

      if (!hipatiaRes.ok) {
        throw new Error("No se pudo cargar los CSV.");
      }
      // send({ status: "CSV cargados", step: "runHipatia" });

      //await loadAll();
      //send({ status: "loadAll completado", step: "loadAll" });

      send({ status: "Todo perfecto." });
      res.end();
    } catch (err) {
      console.error(err);
      if (err.message === "Error: No se pudo encontrar el formulario de descarga o el sesskey") {
        if (tries < 4) {
          send({ status: "Reintentando...", attempt: tries });
          setTimeout(vinagre, 1000);
          return;
        }
      }
      send({ error: err.message });
      res.end();
    }
  }

  vinagre();
});

app.use("/api/bulkLoader", bulkLoaderRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor REST listo en http://localhost:${port} 🚀`);
});
