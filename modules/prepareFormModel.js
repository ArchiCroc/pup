function prepareFormModel(doc) {
  const cleanDoc = {};
  const entries = Object.entries(doc);
  for (const [key, value] of entries) {
    cleanDoc[key] = value === null ? undefined : value;
  }
}

export default prepareFormModel;
