import styled from 'styled-components';

const StyledSearchInput = styled.div`
  position: relative;

  i {
    position: absolute;
    left: 12px;
    top: 10px;
    color: var(--gray-light);
  }

  .form-control {
    padding-left: 30px;
  }
`;

export default StyledSearchInput;
