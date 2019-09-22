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

import '../../api/Documents/server/indexes';

/* #### PLOP_IMPORTS_START #### */
import '../../api/ErrorReports/server/indexes';
import '../../api/ErrorReports/server/rest-api';
/* #### PLOP_IMPORTS_END #### */
