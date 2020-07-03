// Palette
import palette from '../palette';
import { StyleRules } from '@material-ui/core/styles';
import { ChipClassKey } from '@material-ui/core/Chip';

export default {
  root: {
    backgroundColor: palette.primary.light,
    color: '#425A70'
  },
  clickable: {
    '&:hover, &:focus, &:active': {
      backgroundColor: '#EDF0F2'
    }
  },
  deletable: {
    '&:focus': {
      backgroundColor: palette.primary.light
    }
  },
  outlined: {
    '&:hover': {
      backgroundColor: palette.primary.light
    }
  }
} as Partial<StyleRules<ChipClassKey>>;
