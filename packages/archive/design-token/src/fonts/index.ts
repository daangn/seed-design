import type { FontTheme } from './types';

const fonts: Readonly<FontTheme> = Object.freeze({
  scheme: {
    '$system': '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
  },

  /**
   * Font tokens are already defined in its semantic
   * at least yet.
   */
  get semanticScheme() {
    return {
      system: this.scheme.$system,
    };
  },
});

export default fonts;
