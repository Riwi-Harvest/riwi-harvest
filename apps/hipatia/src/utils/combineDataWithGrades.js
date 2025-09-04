
export async function combineDataWithGrades(mainTableData, courseGrades) {
  console.log(
    "Combinando datos principales con todas las calificaciones individuales..."
  );

  const { headers, rows } = mainTableData;
  const newHeaders = [...headers];

  // Recopilar TODAS las actividades individuales de todos los cursos
  const allActivities = new Map();

  Object.entries(courseGrades).forEach((courseData) => {
    Object.entries(courseData).forEach((studentData) => {
      if (studentData.grades) {
        Object.entries(studentData.grades).forEach(
          ([activityName, gradeInfo]) => {
            if (!allActivities.has(activityName)) {
              allActivities.set(activityName, {
                name: activityName,
                activityId: gradeInfo.activityId,
                itemId: gradeInfo.itemId
              });
            }
          }
        );
      }
    });
  });

  console.log(
    `Total de actividades individuales encontradas: ${allActivities.size}`
  );

  console.log(allActivities);

  return;

}
