/**
 * Extracts the module name prefix (e.g., "Módulo 1") from a given string.
 * This is the key part of the logic to link the data.
 * @param {string} taskName The name of the task.
 * @returns {string|null} The normalized module name or null if no pattern is found.
 */
export function extractModuleName(taskName) {
    // This regex looks for either "M" followed by digits, or "Módulo" followed by a space and digits.
    const match = taskName.match(/^(M\d+|Módulo\s\d+)/);
    if (!match) {
        return null;
    }
    // Standardize the output, e.g., "M1" becomes "Módulo 1".
    return match[0].replace(/^M(\d+)/, "Módulo $1");
}
