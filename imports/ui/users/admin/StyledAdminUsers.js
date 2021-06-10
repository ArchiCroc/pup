import styled from 'styled-components';
import PageWrapper from '/imports/ui/components/PageWrapper';

export default styled(PageWrapper)`
  h4 span {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: bold;
    font-size: 15px;
    margin-left: 3px;
    background: var(--gray-lighter);
    color: var(--gray);
  }

  .SearchInput {
    float: right;
    width: 200px;
  }
`;
