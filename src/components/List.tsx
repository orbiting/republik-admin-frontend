import * as React from 'react'
import { css } from 'glamor'

import { colors, fontFamilies } from '@project-r/styleguide'

const styles = {
  list: css({
    fontFamily: fontFamilies.sansSerifRegular,
    fontSize: 17,
    lineHeight: '25px',
    listStyle: 'none',
    margin: '10px 0',
    padding: 0
  }),
  item: css({
    borderTop: `1px solid ${colors.divider}`,
    padding: '5px 0',
    ':last-child': {
      borderBottom: `1px solid ${colors.divider}`
    }
  }),
  highlight: css({
    fontFamily: fontFamilies.sansSerifMedium,
    fontWeight: 'normla'
  })
}

export const Item = ({ children }: any) =>
  <li {...styles.item}>
    {children}
  </li>

const List = ({ children, ...props }: any) =>
  <ul {...props} {...styles.list}>
    {children}
  </ul>

export const Highlight = ({ children }: any) =>
  <span {...styles.highlight}>
    {children}
  </span>

export default List