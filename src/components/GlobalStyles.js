import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root {
    --color-white: #FFFFFF;
    --color-black: #0A0A0B;

    --color-dark: #141417;
    --color-dark-blur: rgba(10, 10, 11, 0.8);
    --color-dark-light: #1D1D21;
    --color-dark-grey: #26262C;
    --color-dark-grey-blur: rgba(36, 38, 44, 0.2);
    --color-grey-dark: #343842;
    --color-grey: #616A87;
    --color-grey-light: #8890A5;

    --color-blue: #3E7DF3;
    --color-blue-blur: rgba(64, 121, 243, 0.1);
    --color-red: #FF6157;
    --color-red-blur: rgba(255, 97, 87, 0.1);
    --color-green: #25CC40;
    --color-yellow: #FFBF2A;


    --font-main: "Karla";
    --font-code: "Source Code Pro";
  }

  * {
    user-select: none;
  }

  body,
  html {
    overflow: hidden overlay;
    background: var(--color-dark-light);
  }

  a {
    cursor: default;
    user-drag: none; 
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 1px solid var(--color-dark-grey);
    background: var(--color-black);
  }

  ::-webkit-scrollbar-thumb:hover {
    border-color: var(--color-grey-dark);
  }
`
