import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import Button from 'antd/lib/button';
// import { Meteor } from 'meteor/meteor';
import message from 'antd/lib/message';
import i18n from 'meteor/universe:i18n';
import AutoForm from 'uniforms/AutoForm';
import LongTextField from 'uniforms-antd/LongTextField';
import addCommentMutation from '../mutations/Comments.gql';
import StyledCommentComposer from './StyledCommentComposer';

import CommentSchema from '../../../api/Comments/schemas/comment';

const CommentComposer = ({ documentId }) => {
  const defaultDoc = { documentId, comment: undefined };
  const [doc, setDoc] = useState();
  const [addComment] = useMutation(addCommentMutation, {
    ignoreResults: true,
    onCompleted: () => {
      // @todo this doesn't seem to be called, is it being dismounted?
      console.log('mutation is complete');
      message.success(i18n.__('Documents.comment_success'));
      // reset the form
      setDoc(defaultDoc);
    },
    onError: (error) => {
      message.error(i18n.__('Documents.comment_error', { error: error.message }));
    },
  });

  const handleSubmit = (form) => {
    const cleanForm = CommentSchema.clean(form);
    addComment({
      variables: cleanForm,
      // refetchQueries: [{ query: editDocumentQuery }],
    });
    setDoc(defaultDoc);
  };

  return (
    <StyledCommentComposer>
      <header>{i18n.__('Documents.add_comment_header')}</header>
      <AutoForm
        name="comment"
        model={doc}
        schema={CommentSchema}
        onSubmit={handleSubmit}
        showInlineError
        placeholder
      >
        <LongTextField
          name="comment"
          label={false}
          placeholder={i18n.__('Documents.comment_placeholder')}
        />

        <Button htmlType="submit" type="primary">
          {i18n.__('Documents.comment_submit')}
        </Button>
      </AutoForm>
    </StyledCommentComposer>
  );
};

CommentComposer.propTypes = {
  documentId: PropTypes.string.isRequired,
};

export default CommentComposer;
