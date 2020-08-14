import createIndex from '../../../libs/server/createIndex';
import ErrorReports from '../ErrorReports';

createIndex(ErrorReports, { createdById: 1 });
