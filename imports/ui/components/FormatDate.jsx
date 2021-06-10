import React from 'react';
import moment from 'moment';
import 'moment-timezone';
import PropTypes from 'prop-types';

const FormatDate = (props) => {
  let timezone = props.timezone && props.timezone;

  if (!timezone) {
    timezone = moment.tz.guess();
  }
  const timestamp = !timezone
    ? moment.utc(props.timestamp)
    : moment.utc(props.timestamp).tz(timezone);

  return <>{timestamp.format(props.format)}</>;
};

FormatDate.defaultProps = {
  timezone: undefined,
  format: 'MMMM Do, YYYY [at] hh:mm a',
};

FormatDate.propTypes = {
  timestamp: PropTypes.string.isRequired,
  timezone: PropTypes.string,
  format: PropTypes.string,
};

export default FormatDate;
