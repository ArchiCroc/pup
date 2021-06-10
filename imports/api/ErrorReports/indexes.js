import createIndex from '/imports/api/libs/utils/createIndex';
import ErrorReports from './ErrorReports';

createIndex(ErrorReports, { _id: 1 });
createIndex(ErrorReports, { level: 1 });
createIndex(ErrorReports, { createdById: 1 });
