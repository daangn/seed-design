import isPseudoClass from '@csstools/postcss-is-pseudo-class';
import logical from 'postcss-logical';
import lynx from 'postcss-lynx';

export default {
  plugins: [
    isPseudoClass(),
    logical(),
    lynx({
      logWarnings: false,
    }),
  ],
};
