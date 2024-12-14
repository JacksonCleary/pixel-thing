export interface iColorScheme {
  dark: string;
  light: string;
  green: string;
  orange: string;
  red: string;
  blue: string;
  yellow: string;
}

interface colorSchemeAssignment {
  name: string;
  colorScheme: iColorScheme;
}

const getCSSVariable = (name: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}`)
      .trim() || fallback
  );
};

export const COLORSCHEMES: Record<string, iColorScheme> = {
  default: {
    dark: getCSSVariable('color-dark', '#212121'),
    light: getCSSVariable('color-light', '#ebdbb2'),
    green: getCSSVariable('color-green', '#7eaa6e'),
    orange: getCSSVariable('color-orange', '#f77c1b'),
    red: getCSSVariable('color-red', '#c93f30'),
    blue: getCSSVariable('color-blue', '#448488'),
    yellow: getCSSVariable('color-yellow', '#e5ad2e'),
  },
};

export const getColorScheme = (
  scheme: string = 'default'
): colorSchemeAssignment => {
  return {
    name: scheme,
    colorScheme: COLORSCHEMES[scheme],
  };
};
