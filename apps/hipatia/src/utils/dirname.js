import path from "path";
import { fileURLToPath } from "url";

/**
 * Une una ruta relativa o absoluta con respecto a un módulo.
 *
 * @param {string | URL} base - Puede ser `import.meta.url`, una ruta absoluta o relativa.
 * @param {string} [file=""] - Archivo o subdirectorio a unir.
 * @returns {string} Ruta resuelta.
 */
function __joindirname(base, file = "") {
  let dir;

  // Si viene como import.meta.url o URL
  if (base instanceof URL || String(base).startsWith("file:")) {
    const filename = fileURLToPath(base);
    dir = path.dirname(filename);
  }
  // Si ya es una ruta absoluta
  else if (path.isAbsolute(base)) {
    dir = base;
  }
  // Si es relativa, la resuelve desde cwd
  else {
    dir = path.join(process.cwd(), base);
  }

  return path.join(dir, file);
}

export { __joindirname };

