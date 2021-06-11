import React, { useMemo } from 'react';
import { gql, useQuery, QueryHookOptions } from '@apollo/client';

interface useQueryForFiltersProps extends Omit<QueryHookOptions, "query"> {
  query: string;
  labelKey: string; 
  valueKey: string; 
  edges?: string;
}

function useQueryForFilters(props: useQueryForFiltersProps) {
  const { query, labelKey, valueKey, edges, ...queryHookOptions } = props;
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

  const { loading, error, data } = useQuery(gqlQuery, queryHookOptions);
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
