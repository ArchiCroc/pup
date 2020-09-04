import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from '../../../libs/uniforms-bridge-simple-schema-2/index';

export default function createSchema(schema = {}) {
  return new SimpleSchema2Bridge(new SimpleSchema(schema));
}
