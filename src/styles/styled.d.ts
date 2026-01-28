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
    shadowStrong: string;
    breakpoints: {
      phoneMax: number;
      tabletMax: number;
      desktopMax: number;
      largeMin: number;
    };
    media: {
      phone: string;
      tablet: string;
      desktop: string;
      large: string;
    };
  }
}
