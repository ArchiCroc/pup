import React, { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function useQueryForFilters(props) {
  const { query, labelField, valueField, edges } = props;
  const gqlQuery = useMemo(() => {
    return gql`
        query selectData {
          ${query}(pageSize: 100) {
            ${edges ? edges + ' {' : ''}
              ${labelField}
              ${valueField}
            ${edges ? '}' : ''}
          }
        }`;
  }, [query, labelField, valueField]);

  const { loading, error, data } = useQuery(gqlQuery, props);
  // eslint-disable-next-line
  const edgeData = data ? (edges ? data[query][edges] : data[query]) : [];

  const filters = [];
  for (const item of edgeData) {
    filters.push({
      text: item[labelField],
      value: item[valueField],
    });
  }

  return { loading, error, data, filters };
}

export default useQueryForFilters;
