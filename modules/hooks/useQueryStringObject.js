import React, { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

function useQueryStringObject(keyPrefix = '') {
  const history = useHistory();
  const location = useLocation();
  return useMemo(() => {
    const rawParams = queryString.parse(location.search, { arrayFormat: 'comma' });
    const cleanParams = {};

    if (keyPrefix) {
      const regex = new RegExp(`^${keyPrefix}`, 'i');
      for (const [key, value] of Object.entries(rawParams)) {
        if (regex.test(key)) {
          cleanParams[key.replace(regex, '')] = value;
        }
      }
    } else {
      Object.assign(cleanParams, rawParams);
    }

    // strip prefix from keys

    function setQueryString(object) {
      for (const [key, value] of Object.entries(object)) {
        // remove keys that are null, undefined or blank
        if (!value && value !== false) {
          delete rawParams[keyPrefix + key];
        } else {
          // merge new keys with the current query object
          rawParams[keyPrefix + key] = value;
        }
      }

      // save that query string to the history
      history.push({
        pathname: location.pathname,
        search: `?${queryString.stringify(rawParams, { arrayFormat: 'comma' })}`,
      });
    }

    return [cleanParams, setQueryString];
  }, [location.search]);
}

export default useQueryStringObject;
