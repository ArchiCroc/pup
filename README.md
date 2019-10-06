### Pup+

An Opinionated take on an even better version of "Pup: The Ultimate Boilerplate for Products".

[Read the Orginal Documentation](https://cleverbeagle.com/pup)

---

### So... What makes this better (in my opinion)

- Groups related React page components into folders by module. One component per file. Page Components in the root, sub components in the components sub folder. 
- Most React Components have been refactored to functions and hooks.
- Removes packages that had dependency on the Meteor Blaze and jQuery modules to help offset the other added packages
- Adds [Simple-Schema] (https://github.com/aldeed/simple-schema-js) to clean and validate all the data coming into the app
- Adds [Uniforms](https://github.com/vazco/uniforms) to handle validation of forms
- Switches to [Ant Design](https://ant.design) as the primary UI Component Library
- Adds [Universe i18n](https://github.com/vazco/meteor-universe-i18n) for i18n support. (Work in Progress)
  - I'm considering swapping to a more full featured i18n Library but this is the one works good enough for the time being. 
- Adds a Plop code generator for quickly adding new modules to the app.  Helps you get to the fun parts faster.
  - Define a schema with all the fields for your module and it can generate the boilerplate react ui and graphql api for
  - See the section below on 
- Changes the UserPreferences Api from dynamic fields to a hard code schema. Use Plop help add new fields.
- Adds a React ErrorBoundary inside each route so a page error doesn't crash the app.
- Adds a predefined module 'ErrorReports' to collect react errors

#### What's the catch?

The Bundle size is bigger.
- [moment](https://www.npmjs.com/package/moment) and [moment-timezone](https://www.npmjs.com/package/moment-timezone) are big and it would be great to use one of the newer alternatves but several other modules used depend on them
- [AntDesign](https://www.npmjs.com/package/antd) while the app only includes the components as needed, The icon import includes EVERYTING which is less than idea. There are some options to investigate in https://github.com/ant-design/ant-design/issues/12011 but I haven't gotten thier import helper working yet
- AntD imports should be split out into specific modules like to prevent loading unused components 
    import Table from 'antd/lib/table';

Mobile Formating needs work
- Getting the menu to collapse bootstrap style on small screens is on my todo list

Testing Coverage still sucks
- Creating default Test via the Plop code generator is on my Roadmap

### Getting Started - Install Prereqs and run the local dev server
```shell
    meteor npm install
    meteor npm run dev
```
Starts default dev server at http://localhost:3000

### Running plop
```shell
    meteor npx plop
```

### Built in Plop Generators
```shell
      AddGraphqlMutation - Add a mutation to an existing API Module
      AddGraphqlQuery - Add a query to an existing API Module
      AddUserSettings - Add User Settings from a schema
    > BasicModule - Create Basic Module with UI, i18n and API from a predefined schema
      BasicApiModule - Create a new api module
      BasicI18nFile - Create an i18n from a predefined schema
      BasicUIModule - Create a new UI module from a predefined schema
      Page - Create a page   
```

#### Example Module Schema
```js
{ 
  "name": "ErrorReports", // module name
  "permissions": { // what api role is required to preform the action
    "read":"admin", // default possible values: everyone|user|admin
    "save": "admin",
    "delete":"admin"
  },
  "menu": { // which pages to add to the menu and which menu do they go in
    "index": "admin" // default possible values: everyone|user|admin
  },
    
  "fields": { // data fields for the module
    "_id": { // fields keys are the name of the field and column to be created
      "primaryKey": true, // primary key for the database. Only one per schema. first one found is used.
      "urlKey": true, // key to use in item in URLs, defaults to primaryKey. Only one per schema. first one found is used.
      "type": "String", // The Graphql Type. String|Int|Float|DateTime|Boolean|<custom type>, wrap in [] for arrays
      "input": "Hidden", // Unforms Type See below for full list of supported values
      "validate" : { // simple-schema validations options see (https://github.com/aldeed/simple-schema-js#schema-rules)
        "max": 24,
        "optional": true
      }
    },
    "userId": {
      "userKey": true,
      "type": "String",
      "input": "CrossReferenceSearch", // CrossReferenceSelect|CrossReferenceSearch are two special input types to pull in data from other modules
      "uniforms": {
        "query": "users", // graphqlQuery to uses
        "edges": "users", //if the query returns like { total: 100, users: [User]}, the name of the subfield that holds the values. Leave undefined if the results are returned directly like [Users]
        "labelField": "fullName", // label field to query to show for each item in the Input
        "valueField": "_id" // value field to query to return when an item is selected
      },
      "showInTableView": false, // Show this field in the table of items on the index page. Possible Values: true (default)| false | String (will be used as the label)
      "showInDetailView": false // Show this field in the table of items on the detail page. Possible Values: true (default)| false  | String (will be used as the label)
    },
    "user": {
      "type": "User", // Example of a custom type, has a built in 
      "dataIndex": "fullName" // which field in the object to display
    },
    "level": {
      "type": "Int",
      "input": "Select",
      "choices": { "Silly": 0, "Debug": 1, "Verbose": 2, "Info": 3, "Warning": 4, "Error": 5 },
      "clean": "(item) => parseInt(item, 10);", // optional helper to clean form input
      "filterable": true // should this field be filterable in data tables. Possible values: true | false (default)
    },
    "message": {
      "labelKey": true, // the primary label field for the module. Only one per schema. First one found is used. Defaults to primaryKey
      "type": "String",
      "input": "Text",
      "validate" : {
          "max": 1024
      },
      "searchable": true // should this field be search in data tables. Possible values: true | false (default)
    },
    "path": {
      "type": "String",
      "input": "Text",
      "validate" : {
        "max": 1024,
        "optional": true
      },
      "searchable": true
    },
    "createdAtUTC": {
      "type": "DateTime",
      "showInTableView": "Created At"
    },
    "createdById": {
      "userKey": true,
      "type": "String",
      "index": true,
      "showInTableView": false,
      "showInDetailView": false
    },
    "createdBy": {
      "type": "User",
      "dataIndex": "fullName"
    }
  },
  "defaultSortField": "createdAtUTC", // in the table and search, default field to sort by
  "defaultSortOrder": "descend" // in the table and search, default field way to order the sort by field
}
```

#### Supported Types
[Graphql Scalar Types](https://www.apollographql.com/docs/apollo-server/schema/schema/): 
- Int, Float, String, Boolean, ID

graphql-iso-date: 
- Date, DateTime

Types Defined by the Pup+ App: 
- Users, Documents, ErrorReports

#### Supported Inputs
[Uniform Fields](https://github.com/vazco/uniforms/blob/master/docs/api-fields.md):

|    Component    |                    Description                    |
| :-------------: | :-----------------------------------------------: |
|   `AutoField`   |       Automatically renders a given field.        |
|  `AutoFields`   |        Automatically renders given fields.        |
|   `BoolField`   |                     Checkbox.                     |
|   `DateField`   |           HTML5 `datetime-local` input.           |
|  `ErrorField`   |         Error message for a given field.          |
|  `ErrorsField`  |  Error message with a list of validation errors.  |
|  `HiddenField`  | Hidden field (with a possibility to omit in DOM). |
| `ListAddField`  |      An icon with action to add a list item.      |
| `ListDelField`  |    An icon with action to remove a list item.     |
|   `ListField`   |              List of nested fields.               |
| `ListItemField` |             Single list item wrapper.             |
| `LongTextField` |                     Textarea.                     |
|   `NestField`   |              Block of nested fields.              |
|   `NumField`    |                  Numeric input.                   |
|  `RadioField`   |                  Radio checkbox.                  |
|  `SelectField`  |       Select (or set of radio checkboxes).        |
|  `SubmitField`  |                  Submit button.                   |
|   `TextField`   |       Text (or any HTML5 compatible) input.       |

Defined in Pup+

|    Component    |                    Description                    |
| :-------------: | :-----------------------------------------------: |
|`CrossReferenceSearchField`| Autocomplete one or multiple values from a different module |
|`CrossReferenceSelectField`| Select one or multiple values from a different module       | 
