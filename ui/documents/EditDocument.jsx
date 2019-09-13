import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import DocumentEditor from './components/DocumentEditor';
import Loading from '../components/Loading';
import NotFound from '../pages/NotFound';
import { editDocument as editDocumentQuery } from './queries/Documents.gql';

const EditDocument = ({ match, history }) => {
  const { loading, data } = useQuery(editDocumentQuery, {
    variables: {
      _id: match.params._id,
    },
  });

  return (
    <React.Fragment>
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          {data.document ? <DocumentEditor doc={data.document} history={history} /> : <NotFound />}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

EditDocument.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default EditDocument;
