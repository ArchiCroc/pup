import React from 'react';
import PropTypes from 'prop-types';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import PageHeader from './PageHeader';

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
    // @todo use an error logging service
    console.log({ error: error.toString(), info }, typeof error, error.message, error.stack);
    const xhr = new XMLHttpRequest();
    const url = '/public-api/v1/error-reports';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-token', Accounts._storedLoginToken());
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const json = JSON.parse(xhr.responseText);
        console.log('[errorReports]', json);
      }
    };
    const data = JSON.stringify({
      message: error.toString(),
      stack: error.stack,
      componentStack: info.componentStack,
      path: this.props.path,
      userToken: Accounts._storedLoginToken(),
    });
    xhr.send(data);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <React.Fragment>
          <PageHeader title={i18n.__('page_error_title')} />
          <Row>
            <Col
              xs={24}
              sm={{ span: 16, offset: 4 }}
              md={{ span: 12, offset: 6 }}
              lg={{ span: 8, offset: 8 }}
            >
              {i18n.__('page_error_message')}
            </Col>
          </Row>
        </React.Fragment>
      );
    }

    return this.props.children;
  }
}

PageErrorBoundary.defaultProps = {
  path: '',
};

PageErrorBoundary.propTypes = {
  path: PropTypes.string,
};

export default PageErrorBoundary;
