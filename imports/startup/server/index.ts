// import Uniforms from 'uniforms';
// import SimpleSchema from 'simpl-schema';
// SimpleSchema.extendOptions(['uniforms']);
// import SimpleSchema2Bridge from '/imports/common/libs/custom-uniforms-bridge-simple-schema-2';
// import i18n from 'meteor/universe:i18n';



import '/i18n';
import './accounts';
import './graphqlApi';
import './browserPolicy';
import './fixtures';
import './email';
//import './sitemap'; // @todo figure out how to modularize sitemaps
import './apolloServer';
import './ssr';
import './restApi';

/* #### PLOP_IMPORTS_START #### */
/* #### USERS_ROLES_IMPORTS_START #### */
// import '/imports/api/Users/Roles/server/indexes';
// import '/imports/api/Users/Roles/server/rest-api';
/* #### USERS_ROLES_IMPORTS_END #### */
/* #### USERSROLES_IMPORTS_START #### */
import '/imports/api/Users/Roles/indexes';
import '/imports/api/Users/Roles/rest';
/* #### USERSROLES_IMPORTS_END #### */
/* #### ERROR_REPORTS_IMPORTS_START #### */
import '/imports/api/ErrorReports/indexes';
import '/imports/api/ErrorReports/rest';
/* #### ERROR_REPORTS_IMPORTS_END #### */
/* #### USERS_IMPORTS_START #### */
import '/imports/api/Users/rest';
/* #### USERS_IMPORTS_END #### */
/* #### PLOP_IMPORTS_END #### */
