import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import i18n from 'meteor/universe:i18n';
import { timeago } from '../../modules/dates';
import BlankState from '../components/BlankState';
import Loading from '../components/Loading';
import { StyledDocuments, DocumentsList, Document } from './StyledDocuments';
import { documents as documentsQuery } from './queries/Documents.gql';
import { addDocument as addDocumentMutation } from './mutations/Documents.gql';

const Documents = ({ history }) => {
  const { loading, data } = useQuery(documentsQuery);
  const [addDocument] = useMutation(addDocumentMutation, {
    onCompleted: (result) => {
      history.push(`/documents/${result.addDocument._id}/edit`);
    },
    refetchQueries: [{ query: documentsQuery }],
  });

  return (
    <StyledDocuments>
      <header className="clearfix">
        <Button type="primary" onClick={addDocument}>
          {i18n.__('Documents.new_document')}
        </Button>
      </header>
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          {data.documents && data.documents.length ? (
            <DocumentsList>
              {data.documents.map(({ _id, isPublic, title, updatedAt }) => (
                <Document key={_id}>
                  <Link to={`/documents/${_id}/edit`} />
                  <header>
                    {isPublic ? (
                      <span className="label label-success">{i18n.__('Documents.public')}</span>
                    ) : (
                      <span className="label label-default">{i18n.__('Documents.private')}</span>
                    )}
                    <h2>{title}</h2>
                    <p>{timeago(updatedAt)}</p>
                  </header>
                </Document>
              ))}
            </DocumentsList>
          ) : (
            <BlankState
              icon={{ style: 'solid', symbol: 'file-alt' }}
              title={i18n.__('Documents.no_documents_title')}
              subtitle={i18n.__('Documents.no_documents_subtitle')}
              action={{
                style: 'success',
                onClick: addDocument,
                label: i18n.__('Documents.add_first_document'),
              }}
            />
          )}
        </React.Fragment>
      )}
    </StyledDocuments>
  );
};

Documents.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Documents;
