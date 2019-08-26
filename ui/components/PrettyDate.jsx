import React from 'react';
import moment from 'moment';
import 'moment-timezone';
import PropTypes from 'prop-types';

const PrettyDate = (props) => {
  let timezone = props.timezone && props.timezone;

  if (!timezone && window.currentTimezone) {
    timezone = window.currentTimezone;
  }
  const timestamp = !timezone
    ? moment.utc(props.timestamp)
    : moment.utc(props.timestamp).tz(timezone);

  return <abbr title={timestamp.format('MMMM Do, YYYY [at] hh:mm a')}>{timestamp.fromNow()}</abbr>;
};

PrettyDate.defaultProps = {
  timezone: undefined,
};

PrettyDate.propTypes = {
  timestamp: PropTypes.string.isRequired,
  timezone: PropTypes.string,
};

export default PrettyDate;
