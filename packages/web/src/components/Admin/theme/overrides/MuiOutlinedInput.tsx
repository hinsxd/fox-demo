import palette from '../palette';
import { StyleRules } from '@material-ui/core/styles';
import { OutlinedInputClassKey } from '@material-ui/core/OutlinedInput';

export default {
  root: {
    '&:hover:not($disabled)': {
      backgroundColor: palette.background.default
    }
  }
} as Partial<StyleRules<OutlinedInputClassKey>>;
