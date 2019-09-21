import React from 'react';
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

export default PageErrorBoundary;
