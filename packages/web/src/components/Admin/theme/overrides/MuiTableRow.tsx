// Palette
import palette from '../palette';
import { StyleRules } from '@material-ui/core/styles';
import { TableRowClassKey } from '@material-ui/core/TableRow';

export default {
  root: {
    height: '56px',
    '&$selected': {
      backgroundColor: palette.background.default
    },
    '&$hover': {
      '&:hover': {
        backgroundColor: palette.background.default
      }
    }
  }
} as Partial<StyleRules<TableRowClassKey>>;
