// routes/uploadRoutes.js
import { Router } from "express";
import { loadCsvToTable } from "../services/bulkLoaderServices.js";

const router = Router();

router.post("/:table", async (req, res) => {
    try {
        const rowsInserted = await loadCsvToTable(req.params.table, req.file.path);
        res.json({ message: `${rowsInserted} filas insertadas en ${req.params.table}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
