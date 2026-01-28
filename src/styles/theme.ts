const breakpoints = {
  phoneMax: 599,
  tabletMax: 1023,
  desktopMax: 1439,
  largeMin: 1440,
};

const media = {
  phone: `@media (max-width: ${breakpoints.phoneMax}px)`,
  tablet: `@media (max-width: ${breakpoints.tabletMax}px)`,
  desktop: `@media (max-width: ${breakpoints.desktopMax}px)`,
  large: `@media (min-width: ${breakpoints.largeMin}px)`,
};

const theme = {
  colors: {
    background: "#0b1221",
    surface: "rgba(255, 255, 255, 0.12)",
    surfaceStrong: "rgba(255, 255, 255, 0.2)",
    border: "rgba(255, 255, 255, 0.25)",
    textPrimary: "#f8f9ff",
    textSecondary: "rgba(248, 249, 255, 0.7)",
    accent: "#7dd3fc",
    accentSecondary: "#a78bfa",
  },
  shadow: "0 18px 50px rgba(10, 18, 38, 0.45)",
  shadowStrong: "0 22px 60px rgba(10, 18, 38, 0.55)",
  breakpoints,
  media,
};

export { theme };
