// Colors
import { primary } from '../colors';
import palette from '../palette';
import { StyleRules } from '@material-ui/core/styles';
import { FilledInputClassKey } from '@material-ui/core/FilledInput';

export default {
  root: {
    backgroundColor: palette.background.default,
    '&:hover': {
      backgroundColor: primary.light
    },
    '&$focused': {
      backgroundColor: primary.light
    }
  }
} as Partial<StyleRules<FilledInputClassKey>>;
