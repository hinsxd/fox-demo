// Palette
import palette from '../palette';
import { StyleRules } from '@material-ui/core/styles';
import { ButtonClassKey } from '@material-ui/core/Button';

export default {
  outlined: {},
  contained: {
    backgroundColor: palette.common.white,
    '&:hover': {
      backgroundColor: '#E4E7EB',
    },
  },
} as Partial<StyleRules<ButtonClassKey>>;
