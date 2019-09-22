import createIndex from '../../../modules/server/createIndex';
import ErrorReports from '../ErrorReports';

createIndex(ErrorReports, { createdById: 1 });
