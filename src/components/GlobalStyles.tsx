import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root {
    --color-white: #FFFFFF;
    --color-black: #000000;

    --color-dark-100: #15151A;
    --color-dark-200: #191920;
    --color-dark-300: #1D1D24;
    --color-dark-400: #302F38;
    --color-dark-500: rgba(48, 47, 56, 0.48);
    --color-dark-600: rgba(48, 47, 56, 0.32);
    --color-dark-700: rgba(48, 47, 56, 0.16);

    --color-gray-100: #7D88A7;
    --color-gray-200: #69738F;
    --color-gray-300: rgba(105, 115, 143, 0.48);
    --color-gray-400: rgba(105, 115, 143, 0.24);

    --color-blue: #0064FE;
    --color-red: #FF6157;
    --color-red-dark: #8C2C26;
    --color-green: #25CC40;
    --color-green-dark: #1E8B2F;
    --color-yellow: #FFBF2A;
    --color-yellow-dark: #C9811B;
    
    --font-main: "Karla";
    --font-code: "Source Code Pro";
  }

  * {
    user-select: none;
  }

  html,
  body {
    font-family: var(--font-main);
    font-weight: 400;
    font-size: 16px;
    background: var(--color-dark-300);
  }

  a {
    cursor: default;
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
  }
`
