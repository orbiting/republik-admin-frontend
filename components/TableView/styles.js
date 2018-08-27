import { css } from 'glamor'
import { colors } from '@project-r/styleguide'

export default {
  formContainer: css({
    maxWidth: '700px',
    margin: '0 auto 3px auto',
  }),
  container: css({
    margin: '20px 0 10px 0',
  }),
  hBox: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    alignContent: 'stretch',
  }),
  vBox: css({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    maxHeight: '80px',
  }),
  statusLabel: css({
    display: 'block',
    color: colors.disabled,
    marginTop: '3px',
    marginBottom: '4px',
  }),
  cell: css({
    width: '33%',
  }),
  cellOne: css({
    width: '33%',
  }),
  cellTwo: css({
    width: '66%',
  }),
  trow: css({
    padding: '10px 0px',
    width: '100%',
    flexwWrap: 'nowrap',
    '&:nth-child(odd)': {
      backgroundColor: colors.secondaryBg,
    },
  }),
  thead: css({
    maxHeight: '40px',
    backgroundColor: '#fff',
    borderBottom: `1px solid ${colors.divider}`,
  }),
  interactive: css({
    cursor: 'pointer',
  }),
  searchField: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    '& > *:not(:first-child)': {
      marginLeft: '10px',
    },
  }),
  filterTitle: css({
    display: 'block',
    textTransform: 'uppercase',
    marginBottom: '12px',
  }),
  submitFilter: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }),
  disabledFilter: css({
    color: colors.disabled,
  }),
  toggleFilterDisplay: css({
    position: 'relative',
  }),
  toggleFilterInput: css({
    position: 'absolute',
    left: '-30px',
    // top: '6px',
  }),
}
