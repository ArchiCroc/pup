/* eslint-disable consistent-return */
import { Mongo } from 'meteor/mongo';
import {ErrorReport} from '/imports/common/ErrorReports/interfaces';

export default new Mongo.Collection<ErrorReport>('errorReports', { idGeneration: 'MONGO' });
