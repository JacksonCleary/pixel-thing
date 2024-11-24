export interface iColorScheme {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
}

export const COLORSCHEMES: Record<string, iColorScheme> = {
  main: {
    primary: '#A3C9A6',
    secondary: '#CADEBD',
    tertiary: '#212121',
    accent: '#FAF1EE',
  },
};

export const getColorScheme = (scheme: string = 'main'): iColorScheme => {
  return COLORSCHEMES[scheme];
};
