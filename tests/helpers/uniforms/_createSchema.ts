import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from '/imports/common/libs/custom-uniforms-bridge-simple-schema-2';

export default function createSchema(schema = {}) {
  return new SimpleSchema2Bridge(new SimpleSchema(schema));
}
