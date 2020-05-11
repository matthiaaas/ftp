import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root {
    --color-white: #FFFFFF;
    --color-black: #0A0A0B;
    
    --font-main: "Karla";
    --font-code: "Source Code Pro";
  }

  * {
    user-select: none;
  }
`
