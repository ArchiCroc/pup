import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import Button from 'antd/lib/button';
// import { Meteor } from 'meteor/meteor';
import message from 'antd/lib/message';
import i18n from 'meteor/universe:i18n';
import AutoForm from 'uniforms/AutoForm';
import LongTextField from 'uniforms-antd/LongTextField';
import addCommentMutation from '../mutations/Comments.gql';
import StyledCommentComposer from './StyledCommentComposer';

import CommentSchema from '../../../api/Comments/schemas/comment';

class CommentComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { doc: { documentId: this.props.documentId } };
  }

  onSubmit = (mutate, form) => {
    const cleanForm = CommentSchema.clean(form);
    mutate({
      variables: cleanForm,
      // refetchQueries: [{ query: editDocumentQuery }],
    });
    this.setState({ doc: { documentId: this.props.documentId, comment: undefined } });
  };

  render() {
    return (
      <StyledCommentComposer>
        <header>Add a Comment</header>
        <Mutation
          ignoreResults
          mutation={addCommentMutation}
          onCompleted={() => {
            // @todo this doesn't seem to be called, is it being dismounted?
            console.log('mutation is complete');
            message.success(i18n.__('Documents.comment_success'));
            // reset the form
            this.setState({ doc: { documentId: this.props.documentId, comment: undefined } });
          }}
          onError={(error) => {
            message.danger(i18n.__('Documents.comment_error'));
          }}
        >
          {(mutate) => (
            <AutoForm
              name="comment"
              model={this.state.doc}
              schema={CommentSchema}
              onSubmit={(form) => this.onSubmit(mutate, form)}
              showInlineError
              placeholder
            >
              <LongTextField
                name="comment"
                label={false}
                placeholder={i18n.__('Documents.comment_placeholder')}
              />

              <Button type="submit" type="primary">
                {i18n.__('Documents.comment_submit')}
              </Button>
            </AutoForm>
          )}
        </Mutation>
      </StyledCommentComposer>
    );
  }
}
CommentComposer.propTypes = {
  documentId: PropTypes.string.isRequired,
};

export default CommentComposer;
