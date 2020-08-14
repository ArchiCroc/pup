import createIndex from '../../../libs/server/createIndex';
import ErrorReports from '../ErrorReports';

createIndex(ErrorReports, { _id: 1 });
createIndex(ErrorReports, { level: 1 });
