import { css } from 'glamor'
import { colors } from '@project-r/styleguide'

export const tableView = {
  formContainer: css({
    width: '100%',
    margin: '30px 0 80px 0',
  }),
  form: css({
    maxWidth: '700px',
    margin: '0 auto 3px auto',
  }),
  formSection: css({
    margin: '20px 0 10px 0',
    minHeight: '110px',
  }),
  formActions: css({
    margin: '15px 0 27px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    '& > *:not(:first-child)': {
      marginLeft: '20px',
    },
  }),
  tableInfo: css({
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
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
