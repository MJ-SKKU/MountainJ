import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const styled = { createGlobalStyle };

const GlobalStyle = styled.createGlobalStyle`
  ${reset}

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: "Noto Sans", "Noto Sans KR", "Arial", sans-serif;
    line-height: 1.5;
  }
`;

export default GlobalStyle;
