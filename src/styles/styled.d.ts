import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      surfaceStrong: string;
      border: string;
      textPrimary: string;
      textSecondary: string;
      accent: string;
      accentSecondary: string;
    };
    shadow: string;
  }
}
