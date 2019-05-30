import styled from 'styled-components';

const StyledApp = styled.div`
  visibility: ${(props) => (props.ready && !props.loading ? 'visible' : 'hidden')};
  padding-bottom: 60px;

  > .container {
    margin-bottom: 80px;
    padding-bottom: 20px;
  }

  .verify-email {
    margin-bottom: 0;
    padding: 0;
    border-top: none;
    border-bottom: 1px solid #e7e7e7;
    background: #fff;
    color: var(--gray-dark);
    border-radius: 0;

    p {
      padding: 19px;
    }

    .btn {
      padding: 0;
    }
  }
  .layout {
    height: 100%;
  }

  .content {
    padding: 10px 0;
  }

  .app-grid {
    padding: 20px 40px;
    background-color: #fff;
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: #000;
    border-top: 1px solid var(--gray-lighter);
    /* padding: 20px 0; */
  }
`;

export default StyledApp;
