import cors from "cors";
import express from 'express';
import { runHipatia } from "../hipatia/src/index.js";
import bulkLoaderRoutes from "./routes/bulkLoaderRoutes.js";
import compositeRoutes from "./routes/compositeRoutes.js";
import generalRoutes from "./routes/generalRoutes.js";
import { loadAll } from "./script/loadCsv.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// General (PK simple)
app.use("/api/general", generalRoutes);

// Composite (PK compuesta)
app.use("/api/composite", compositeRoutes);

// Upload CSVs
app.get("/vinagre", async (req, res) => {
  let tries = 0;

  async function vinagre() {
    try {
      tries += 1;
      const hipatiaRes = await runHipatia();

      if (!hipatiaRes.ok) {
        throw new Error("No se pudo cargar los CSV.");
      }

      await loadAll();

      res.status(200).json({ message: 'Todo perfecto.' });
    } catch (err) {
      console.error(err);
      if (err.message === "No se pudo encontrar el formulario de descarga o el sesskey") {
        if (tries < 4) {
          tries += 1;
          console.log('Reintentando...')
          setTimeout(() => {
            vinagre();
          }, 1000);
          return;
        }
      }
      res.status(500).json({ message: 'Error', error: err.message })
    }
  }

  vinagre();
})

app.use("/api/bulkLoader", bulkLoaderRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor REST listo en http://localhost:${port} 🚀`);
});
