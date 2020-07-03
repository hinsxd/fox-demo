import palette from '../palette';
import { StyleRules } from '@material-ui/core/styles';
import { ListItemIconClassKey } from '@material-ui/core/ListItemIcon';

export default {
  root: {
    color: palette.text.secondary,
    minWidth: '32px'
  }
} as Partial<StyleRules<ListItemIconClassKey>>;
