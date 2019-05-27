import React from 'react';
import Alert from 'antd/lib/alert';
import { Meteor } from 'meteor/meteor';

const NotFound = () => (
  <div className="NotFound">
    <Alert
      type="danger"
      message="Error [404]"
      description={`${Meteor.isClient ? window.location.pathname : ''}does not exist.`}
    />
  </div>
);

export default NotFound;
