import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import { Meteor } from 'meteor/meteor';
import SEO from '../components/SEO';
import BlankState from '../components/BlankState';
import Comments from './components/Comments';
import { document as documentQuery } from './queries/Documents.gql';
import parseMarkdown from '../../modules/parseMarkdown';
import CommentComposer from './components/CommentComposer';

import { StyledViewDocument, DocumentBody } from './StyledViewDocument';

const ViewDocument = ({ match }) => {
  const { loading, data, subscribeToMore } = useQuery(documentQuery, {
    variables: {
      _id: match.params._id,
    },
  });
  console.log('subscribeToMore', subscribeToMore);

  // state = {
  //   sortBy: 'newestFirst',
  // };

  // componentWillMount() {
  //   const { data } = this.props;
  //   if (Meteor.isClient && Meteor.userId()) data.refetch();
  // }

  // handleChangeCommentSort = (event) => {
  //   const { data } = this.props;
  //   event.persist();

  //   this.setState({ sortBy: event.target.value }, () => {
  //     data.refetch({ sortBy: event.target.value });
  //   });
  // };

  if (!loading && data.document) {
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
            twitter={Meteor.settings.public.twitterUsername}
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
        {/* <Comments
            documentId={data.document && data.document._id}
            comments={data.document && data.document.comments}
            sortBy={sortBy}
            onChangeSortBy={this.handleChangeCommentSort}
          /> */}
      </React.Fragment>
    );
  }

  if (!data.loading && !data.document) {
    return (
      <BlankState
        icon={{ style: 'solid', symbol: 'file-alt' }}
        title={i18n.__('blank_state_title')}
        subtitle={i18n.__('blank_state_subtitle')}
      />
    );
  }

  return null;
};

ViewDocument.propTypes = {
  match: PropTypes.object.isRequired,
};

export default ViewDocument;
