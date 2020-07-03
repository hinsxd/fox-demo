import palette from '../palette';
import { StyleRules } from '@material-ui/core/styles';
import { IconButtonClassKey } from '@material-ui/core/IconButton';

export default {
  root: {
    padding: '10px',
    color: palette.text.secondary,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)'
    }
  }
} as Partial<StyleRules<IconButtonClassKey>>;
