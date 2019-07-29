/* eslint-disable max-len, no-return-assign */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-antd/AutoField';
import LongTextField from 'uniforms-antd/LongTextField';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/react-hooks';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Dropdown from '../../components/Dropdown';

import { editDocument as editDocumentQuery, documents } from '../queries/Documents.gql';
import {
  //  updateDocument as updateDocumentMutation,
  removeDocument as removeDocumentMutation,
  updateDocumentKey as updateDocumentKeyMutation,
} from '../mutations/Documents.gql';
import delay from '../../../modules/delay';
import { timeago } from '../../../modules/dates';
import DocumentSchema from '../../../api/Documents/schemas/document';

import {
  StyledDocumentEditor,
  DocumentEditorHeader,
  DocumentEditorTitle,
  DocumentEditorBody,
  DocumentEditorFooter,
} from './StyledDocumentEditor';

const DocumentEditor = ({ doc, history }) => {
  const [saving, setSaving] = useState(false);
  const [removeDocument] = useMutation(removeDocumentMutation, {
    ignoreResults: true,
    refetchQueries: [{ query: documents }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      history.push('/documents');
      message.success(i18n.__('Documents.document_removed_success'));
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateDocumentKey] = useMutation(updateDocumentKeyMutation, {
    ignoreResults: true,
    onCompleted: () => {
      setTimeout(() => setSaving(false), 1000);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  // const [updateDocument] = useMutation(updateDocumentMutation, {
  //   ignoreResults: true,
  //   onCompleted:() => {
  //     setTimeout(() => setSaving(false), 1000);
  //   },
  //   onError:(error) => {
  //     message.error(error.message);
  //   }
  // });

  function handleUpdateDocument(key, value) {
    // const cleanForm = DocumentSchema.clean(form);
    setSaving(true);

    delay(() => {
      updateDocumentKey({
        variables: {
          _id: doc._id,
          key,
          value,
        },
        refetchQueries: [{ query: editDocumentQuery }],
      });
    }, 300);
  }

  function handleSetVisibility(isPublic) {
    setSaving(true);
    updateDocumentKey({
      variables: {
        _id: doc._id,
        key: 'isPublic',
        value: (isPublic === 'public').toString(),
      },
    });
  }

  function handleRemoveDocument() {
    Modal.confirm({
      title: i18n.__('Documents.confirm_remove_document'),
      okText: i18n.__('Documents.delete_document'),
      okType: 'danger',
      cancelText: i18n.__('documents.cancel'),
      onOk() {
        removeDocument({
          variables: {
            _id: doc._id,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <React.Fragment>
      <DocumentEditorHeader className="clearfix">
        <p>
          {saving ? (
            <em>{i18n.__('Documents.saving')}</em>
          ) : (
            <span>{i18n.__('Documents.last_edit_time', { timeago: timeago(doc.updatedAt) })}</span>
          )}
        </p>

        <Dropdown title={<Icon type="setting" />} id="set-document-public">
          <Menu>
            <Menu.Item key="view" onClick={() => history.push(`/documents/${doc._id}`)}>
              <Icon type="file" />
              {i18n.__('Documents.view_document')}
            </Menu.Item>
            <Menu.Divider />

            <Menu.ItemGroup title={i18n.__('Documents.visibility')}>
              <Menu.Item
                className={doc.isPublic && 'active'}
                key="public"
                onClick={() => handleSetVisibility('public')}
              >
                <Icon type="unlock" theme={doc.isPublic ? 'filled' : 'outlined'} />
                {i18n.__('Documents.public')}
              </Menu.Item>
              <Menu.Item
                className={!doc.isPublic && 'active'}
                key="private"
                onClick={() => handleSetVisibility('private')}
              >
                <Icon type="lock" theme={!doc.isPublic ? 'filled' : 'outlined'} />
                {i18n.__('Documents.private')}
              </Menu.Item>
            </Menu.ItemGroup>

            <Menu.Divider />

            <Menu.Item key="delete" onClick={handleRemoveDocument}>
              <div className="text-danger">{i18n.__('Documents.delete_document')}</div>
            </Menu.Item>
          </Menu>
        </Dropdown>
      </DocumentEditorHeader>
      <StyledDocumentEditor>
        <AutoForm
          name="document"
          model={doc}
          schema={DocumentSchema}
          onChange={handleUpdateDocument}
          showInlineError
          placeholder
        >
          <DocumentEditorTitle>
            <AutoField name="title" placeholder={i18n.__('Documents.title_placeholder')} />
          </DocumentEditorTitle>
          <DocumentEditorBody>
            <LongTextField name="body" placeholder={i18n.__('Documents.body_placeholder')} />
          </DocumentEditorBody>
        </AutoForm>
      </StyledDocumentEditor>
      <DocumentEditorFooter className="clearfix">
        <span>
          <svg width="63" height="39" viewBox="0 0 256 158" preserveAspectRatio="xMinYMin meet">
            <path d="M238.371 157.892H18.395C8.431 157.892 0 149.462 0 139.497V18.395C0 8.431 8.431 0 18.395 0h219.21C247.569 0 256 8.431 256 18.395v121.102c0 9.964-7.665 18.395-17.629 18.395zM18.395 12.263c-3.066 0-6.132 3.066-6.132 6.132v121.102c0 3.832 3.066 6.132 6.132 6.132h219.21c3.832 0 6.132-3.066 6.132-6.132V18.395c0-3.832-3.066-6.132-6.132-6.132H18.395zM36.79 121.102V36.79h24.527l24.527 30.66 24.527-30.66h24.527v84.312h-24.527V72.814l-24.527 30.66-24.527-30.66v48.288H36.79zm154.06 0l-36.79-40.623h24.527V36.79h24.527v42.923h24.527l-36.79 41.389z" />
          </svg>
          <p>
            <a
              href="https://www.markdownguide.org/basic-syntax"
              target="_blank"
              rel="noopener noreferrer"
            >
              {i18n.__('Documents.body_help')}
            </a>
          </p>
        </span>
      </DocumentEditorFooter>
    </React.Fragment>
  );
};

DocumentEditor.defaultProps = {
  doc: null,
};

DocumentEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default DocumentEditor;
