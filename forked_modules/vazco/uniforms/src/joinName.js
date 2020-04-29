export default function joinName() {
  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }

  const name = parts.reduce(
    (parts, part) =>
      part || part === 0 ? parts.concat(typeof part === 'string' ? part.split('.') : part) : parts,
    [],
  );
  return parts[0] === null ? name.map((part) => part.toString()) : name.join('.');
}
