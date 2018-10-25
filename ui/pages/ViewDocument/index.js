import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Meteor } from 'meteor/meteor';
import SEO from '../../components/SEO';
import FetchData from '../../components/FetchData';
import BlankState from '../../components/BlankState';
import Comments from '../../components/Comments';
import { document as documentQuery } from '../../queries/Documents.gql';
import parseMarkdown from '../../../modules/parseMarkdown';

import { StyledViewDocument, DocumentBody } from './styles';

class ViewDocument extends React.Component {
  componentWillMount() {
    if (Meteor.isClient && document.body) document.body.classList.add('isViewDocument');
  }

  componentWillUnmount() {
    if (Meteor.isClient && document.body) document.body.classList.remove('isViewDocument');
  }

  render() {
    const { data } = this.props;
    if (Meteor.isClient && Meteor.userId()) data.refetch();

    if (!data.loading && data.document) {
      return (
        <React.Fragment>
          <StyledViewDocument>
            <SEO
              title={data.document && data.document.title}
              description={data.document && data.document.body}
              url={`documents/${data.document && data.document._id}`}
              contentType="article"
              published={data.document && data.document.createdAt}
              updated={data.document && data.document.updatedAt}
              twitter="clvrbgl"
            />
            <React.Fragment>
              <h1>{data.document && data.document.title}</h1>
              <DocumentBody
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(data.document && data.document.body),
                }}
              />
            </React.Fragment>
          </StyledViewDocument>
          <Comments
            documentId={data.document && data.document._id}
            comments={data.document && data.document.comments}
          />
        </React.Fragment>
      );
    }

    if (!data.loading && !data.document) {
      return (
        <BlankState
          icon={{ style: 'solid', symbol: 'file-alt' }}
          title="No document here, friend!"
          subtitle="Make sure to double check the URL! If it's correct, this is probably a private document."
        />
      );
    }

    return null;
  }
}

ViewDocument.propTypes = {
  data: PropTypes.object.isRequired,
};

export default graphql(documentQuery, {
  options: ({ match }) => ({
    variables: {
      _id: match.params._id,
    },
  }),
})(ViewDocument);
