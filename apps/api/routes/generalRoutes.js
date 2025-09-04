import { Router } from "express";
import * as service from "../services/generalServices.js";

const router = Router();

// GET all
router.get("/:table", async (req, res, next) => {
  try {
    const rows = await service.getAll(req.params.table);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET by ID
router.get("/:table/:idColumn/:id", async (req, res, next) => {
  try {
    const { table, idColumn, id } = req.params;
    const row = await service.getById(table, idColumn, id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// POST
router.post("/:table", async (req, res, next) => {
  try {
    const result = await service.insert(req.params.table, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// PUT
router.put("/:table/:idColumn/:id", async (req, res, next) => {
  try {
    const { table, idColumn, id } = req.params;
    const result = await service.update(table, idColumn, id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:table/:idColumn/:id", async (req, res, next) => {
  try {
    const { table, idColumn, id } = req.params;
    const ok = await service.remove(table, idColumn, id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
