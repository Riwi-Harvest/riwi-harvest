export function getTaskType(taskName) {
  const lowerCaseName = taskName.toLowerCase();

  if (lowerCaseName.includes('prueba de desempeño') || lowerCaseName.includes('assessment')) {
    return 'Module assessment';
  } else if (lowerCaseName.includes('review')) {
    return 'Review';
  } else {
    return 'Training';
  }
}
