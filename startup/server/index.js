import Uniforms from 'uniforms';
import SimpleSchema2Bridge from '../../libs/uniforms-bridge-simple-schema-2/index';
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
/* #### USERS_ROLES_IMPORTS_START #### */
// import '../../api/Users/Roles/server/indexes';
// import '../../api/Users/Roles/server/rest-api';
/* #### USERS_ROLES_IMPORTS_END #### */
/* #### USERSROLES_IMPORTS_START #### */
import '../../api/Users/Roles/server/indexes';
import '../../api/Users/Roles/server/rest-api';
/* #### USERSROLES_IMPORTS_END #### */
/* #### ERROR_REPORTS_IMPORTS_START #### */
import '../../api/ErrorReports/server/indexes';
import '../../api/ErrorReports/server/rest-api';
/* #### ERROR_REPORTS_IMPORTS_END #### */
/* #### USERS_IMPORTS_START #### */
import '../../api/Users/server/rest-api';
/* #### USERS_IMPORTS_END #### */
/* #### PLOP_IMPORTS_END #### */
