import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

// for prettier formatting
const styled = { createGlobalStyle };

const GlobalStyle = styled.createGlobalStyle`
  ${reset}

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: ${({ theme }) => theme.font.family.base};
  }
`;

export default GlobalStyle;
