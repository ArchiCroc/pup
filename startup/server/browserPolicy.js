import { BrowserPolicy } from 'meteor/browser-policy-common';

// FontAwesome
BrowserPolicy.content.allowOriginForAll('use.fontawesome.com');

// GraphQL Playground
BrowserPolicy.content.allowOriginForAll('graphcool-playground.netlify.com');
BrowserPolicy.content.allowOriginForAll('cdn.jsdelivr.net'); // Also for antd css

// Replace these with your own content URLs
BrowserPolicy.content.allowOriginForAll('cleverbeagle-assets.s3.amazonaws.com');
BrowserPolicy.content.allowOriginForAll('s3-us-west-2.amazonaws.com');
BrowserPolicy.content.allowFontOrigin('data:');
