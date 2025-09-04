import { extractModuleName } from "./extractModuleName.js";

/**
 * Links tasks to their corresponding modules by matching their names and course IDs.
 * @param {Array} modules The array of module objects.
 * @param {Array} tasks The array of task objects.
 * @returns {Array} The updated tasks array with the `id_module` property.
 */
export function linkModulesToTasks(modules, tasks) {
    // 1. Create a map for efficient lookup. The key will be a combination of the
    //    normalized module name and the course ID to handle duplicated module names.
    const moduleMap = new Map();
    modules.forEach(module => {
        const normalizedName = extractModuleName(module.name);
        if (normalizedName) {
            const key = `${normalizedName}-${module.id_course}`;
            moduleMap.set(key, module.id_module);
        }
    });

    // 2. Map the tasks to add the id_module, pero quitando course_id.
    const linkedTasks = tasks.map(task => {
        const normalizedTaskName = extractModuleName(task.name);
        const taskKey = normalizedTaskName
            ? `${normalizedTaskName}-${task.course_id}`
            : null;
        const moduleId = taskKey ? moduleMap.get(taskKey) || null : null;

        // Retornamos el task sin course_id
        const { course_id, ...rest } = task;

        return {
            ...rest,
            id_module: moduleId
        };
    });

    return linkedTasks;
}
