import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

function useQueryForFilters(props) {
  const { query, labelKey, valueKey, edges } = props;
  const gqlQuery = useMemo(() => {
    return gql`
        query selectData($_ids: [ObjectID]) {
       
            ${query}(_ids: $_ids, pageSize: 100) {
              ${edges ? edges + ' {' : ''}
                ${labelKey}
                ${valueKey}
              ${edges ? '}' : ''}
            }
          
        }`;
  }, [query, labelKey, valueKey]);

  const { loading, error, data } = useQuery(gqlQuery, props);
  // eslint-disable-next-line
  const edgeData = data ? (edges ? data[query][edges] : data[query]) : [];

  const filters = [];
  for (const item of edgeData) {
    filters.push({
      text: item[labelKey],
      value: item[valueKey],
    });
  }

  return { loading, error, data, filters };
}

export default useQueryForFilters;
