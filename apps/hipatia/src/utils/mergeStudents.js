export function mergeStudents(data) {
  const merged = {};

  data.flat().forEach(student => {
    const { studentId, studentName, taskId, grades } = student;

    if (!merged[studentId]) {
      merged[studentId] = {
        id_coder: studentId,
        name: studentName,
        grades: {}
      };
    }

    const currentGrades = merged[studentId].grades;

    for (const [gradeName, gradeData] of Object.entries(grades)) {
      currentGrades[`task_${taskId}-${gradeName}`] = gradeData;
    }
  });

  return Object.values(merged);
}
