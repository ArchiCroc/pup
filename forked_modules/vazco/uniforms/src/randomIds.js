// @flow

// Workaround for SSR
// https://github.com/vazco/uniforms/issues/40
// https://github.com/facebook/react/issues/4000
function randomIdsGenerator(prefix) {
  let counter = 0;
  return () => ''.concat(prefix, '-').concat(('000' + (counter++).toString(36)).slice(-4));
}

const randomIdPrefix = randomIdsGenerator('uniforms');

export default function randomIds() {
  let prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : randomIdPrefix();
  return randomIdsGenerator(prefix);
}
