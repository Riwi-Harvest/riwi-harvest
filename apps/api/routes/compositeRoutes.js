import { Router } from "express";
import * as composite from "../services/compositeServices.js";

const router = Router();

// GET by composite keys
router.get("/:table", async (req, res, next) => {
  try {
    // Las keys deben venir en query params ?id_coder=1&id_course=2
    const row = await composite.getByIdComposite(req.params.table, req.query);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// POST
router.post("/:table", async (req, res, next) => {
  try {
    const result = await composite.insertComposite(req.params.table, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// PUT
router.put("/:table", async (req, res, next) => {
  try {
    // Claves en query params, datos en body
    const result = await composite.updateComposite(req.params.table, req.query, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:table", async (req, res, next) => {
  try {
    const result = await composite.removeComposite(req.params.table, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
