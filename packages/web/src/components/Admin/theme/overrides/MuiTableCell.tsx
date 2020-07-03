// Palette
import palette from '../palette';
import { StyleRules } from '@material-ui/core/styles';
import { TableCellClassKey } from '@material-ui/core/TableCell';

export default {
  root: {
    borderBottom: `1px solid ${palette.divider}`,
    padding: '14px 40px 14px 24px'
  },
  head: {
    fontSize: '14px',
    color: palette.text.primary
  }
} as Partial<StyleRules<TableCellClassKey>>;
