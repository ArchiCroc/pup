/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import LongTextField from 'uniforms-bootstrap3/LongTextField';
import i18n from 'meteor/universe:i18n';
import { Mutation } from 'react-apollo';
import { Bert } from 'meteor/themeteorchef:bert';
import Icon from '../../components/Icon';
<<<<<<< HEAD:ui/components/DocumentEditor/index.js
import { editDocument as editDocumentQuery, documents } from '../../queries/Documents.gql';
import { updateDocument, removeDocument, updateDocumentKey } from '../../mutations/Documents.gql';
=======
import { editDocument as editDocumentQuery, documents } from '../queries/Documents.gql';
import { updateDocument, removeDocument } from '../mutations/Documents.gql';
>>>>>>> a936134e9a65750e8afa972cacbc538c8cc31f68:ui/documents/components/DocumentEditor.js
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

class DocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { saving: false };
  }

  handleUpdateDocument = (mutate, key, value) => {
    console.log(key, value);
    // return;
    // const cleanForm = DocumentSchema.clean(form);

    this.setState({ saving: true }, () => {
      delay(() => {
        mutate({
          variables: {
            _id: this.props.doc._id,
            key,
            value,
          },
          refetchQueries: [{ query: editDocumentQuery }],
        });
      }, 300);
    });
  };

  handleSetVisibility = (mutate, isPublic) => {
    this.setState({ saving: true }, () => {
      mutate({
        variables: {
          _id: this.props.doc._id,
          key: 'isPublic',
          value: isPublic === 'public',
        },
      });
    });
  };

  handleRemoveDocument = (mutate) => {
    if (confirm('Are you sure? This is permanent!')) {
      mutate({
        variables: {
          _id: this.props.doc._id,
        },
      });
    }
  };

  render() {
    const { doc, history } = this.props;
    return (
      <React.Fragment>
        <DocumentEditorHeader className="clearfix">
          <p>
            {this.state.saving ? (
              <em>{i18n.__('Documents.saving')}</em>
            ) : (
              <span>
                {i18n.__('Documents.last_edit_time', { timeago: timeago(doc.updatedAt) })}
              </span>
            )}
          </p>
          <DropdownButton
            bsStyle="default"
            title={
              <span>
                <Icon iconStyle="solid" icon="gear" />
              </span>
            }
            id="set-document-public"
          >
            <MenuItem onClick={() => history.push(`/documents/${doc._id}`)}>
              <Icon iconStyle="solid" icon="external-link-alt" />
              {i18n.__('Documents.view_document')}
            </MenuItem>
            <MenuItem divider />
            <Mutation
              ignoreResults
              mutation={updateDocumentKey}
              onCompleted={() => {
                setTimeout(() => this.setState({ saving: false }), 1000);
              }}
              onError={(error) => {
                Bert.alert(error.message, 'danger');
              }}
            >
              {(mutate) => (
                <React.Fragment>
                  <MenuItem header>{i18n.__('Documents.visibility')}</MenuItem>

                  <MenuItem
                    className={doc.isPublic && 'active'}
                    eventKey="1"
                    onClick={() => this.handleSetVisibility(mutate, 'public')}
                  >
                    <Icon iconStyle="solid" icon="unlock" />
                    {i18n.__('Documents.public')}
                  </MenuItem>
                  <MenuItem
                    className={!doc.isPublic && 'active'}
                    eventKey="2"
                    onClick={() => this.handleSetVisibility(mutate, 'private')}
                  >
                    <Icon iconStyle="solid" icon="lock" />
                    {i18n.__('Documents.private')}
                  </MenuItem>
                </React.Fragment>
              )}
            </Mutation>
            <MenuItem divider />
            <Mutation
              ignoreResults
              mutation={removeDocument}
              refetchQueries={[{ query: documents }]}
              awaitRefetchQueries
              onCompleted={() => {
                history.push('/documents');
                Bert.alert('Document removed!', 'success');
              }}
              onError={(error) => {
                Bert.alert(error.message, 'danger');
              }}
            >
              {(mutate) => (
                <MenuItem onClick={() => this.handleRemoveDocument(mutate)}>
                  <span className="text-danger">{i18n.__('Documents.delete_document')}</span>
                </MenuItem>
              )}
            </Mutation>
          </DropdownButton>
        </DocumentEditorHeader>
        <StyledDocumentEditor>
          <Mutation
            ignoreResults
            mutation={updateDocumentKey}
            onCompleted={() => {
              setTimeout(() => this.setState({ saving: false }), 1000);
            }}
            onError={(error) => {
              Bert.alert(error.message, 'danger');
            }}
          >
            {(mutate) => (
              <AutoForm
                name="document"
                model={doc}
                schema={DocumentSchema}
                onChange={(key, value) => this.handleUpdateDocument(mutate, key, value)}
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
            )}
          </Mutation>
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
  }
}

DocumentEditor.defaultProps = {
  doc: null,
};

DocumentEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default DocumentEditor;
