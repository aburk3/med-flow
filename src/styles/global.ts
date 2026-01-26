import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    padding: 0;
    margin: 0;
    min-height: 100%;
  }

  body {
    font-family: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial,
      "Noto Sans", "Liberation Sans", sans-serif;
    color: ${({ theme }) => theme.colors.textPrimary};
    background: radial-gradient(circle at top left, rgba(125, 211, 252, 0.25), transparent 45%),
      radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.25), transparent 50%),
      linear-gradient(135deg, #0b1221 0%, #0f1b33 50%, #0c1428 100%);
    background-attachment: fixed;
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  @keyframes glassGlow {
    0% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0.4;
    }
  }

  @keyframes floatSlow {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-6px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

export { GlobalStyle };
