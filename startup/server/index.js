import Uniforms from 'uniforms';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import i18n from 'meteor/universe:i18n';

import '../../i18n';
import './accounts';
import './graphql-api';
import './browserPolicy';
import './fixtures';
import './email';
import './sitemap';
import './graphql';
import './ssr';
import './rest-api';

/* #### PLOP_IMPORTS_START #### */
/* #### ERROR_REPORTS_IMPORTS_START #### */
import '../../api/ErrorReports/server/indexes';
import '../../api/ErrorReports/server/rest-api';
/* #### ERROR_REPORTS_IMPORTS_END #### */
/* #### DOCUMENTS_IMPORTS_START #### */
import '../../api/Documents/server/indexes';
/* #### DOCUMENTS_IMPORTS_END #### */
/* #### PLOP_IMPORTS_END #### */
