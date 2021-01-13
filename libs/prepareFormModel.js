function prepareFormModel(doc) {
  const cleanDoc = {};
  if (!doc) {
    return cleanDoc;
  }
  const entries = Object.entries(doc);
  for (const [key, value] of entries) {
    cleanDoc[key] = value === null ? undefined : value;
  }
  return cleanDoc;
}

export default prepareFormModel;
