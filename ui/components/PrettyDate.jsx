import React from 'react';
import moment from 'moment';
import 'moment-timezone';
import PropTypes from 'prop-types';

const PrettyDate = (props) => {
  if (!timestamp) {
    return props.emptyText;
  }

  let timezone = props.timezone && props.timezone;

  if (!timezone) {
    timezone = window.currentTimezone ? window.currentTimezone : moment.tz.guess();
  }

  const timestamp = !timezone
    ? moment.utc(props.timestamp)
    : moment.utc(props.timestamp).tz(timezone);

  return <abbr title={timestamp.format('MMMM Do, YYYY [at] hh:mm a')}>{timestamp.fromNow()}</abbr>;
};

PrettyDate.defaultProps = {
  timestamp: undefined,
  timezone: undefined,
  emptyText: '',
};

PrettyDate.propTypes = {
  timestamp: PropTypes.oneOf([PropTypes.instanceOf(Date), PropTypes.string]),
  timezone: PropTypes.string,
  emptyText: PropTypes.node,
};

export default PrettyDate;
