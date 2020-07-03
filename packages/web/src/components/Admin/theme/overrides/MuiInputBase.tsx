import palette from '../palette';
import { StyleRules } from '@material-ui/core/styles';
import { InputBaseClassKey } from '@material-ui/core/InputBase';

export default {
  root: {
    color: palette.text.secondary
  }
} as Partial<StyleRules<InputBaseClassKey>>;
