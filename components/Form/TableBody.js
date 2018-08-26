import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import { colors } from '@project-r/styleguide'
import { Table, Row, Cell } from '../Layout/Table'

const styles = {
  row: css({
    padding: '10px 0px',
    width: '100%',
    flexwWrap: 'nowrap',
    '&:nth-child(odd)': {
      backgroundColor: colors.secondaryBg,
    },
  }),
}

export default class TableBody extends Component {
  renderInner({ value }) {
    return value
  }

  renderField(item, field, value, opts) {
    const { renderField } = this.props
    const { width } = opts

    const cellProps = {
      flex: `0 0 ${width}`,
    }

    const innerProps = {
      item,
      field,
      value,
    }

    const Inner =
      (renderField && renderField(field)) ||
      this.renderInner

    return (
      <Cell key={field} {...cellProps}>
        <Inner {...innerProps} />
      </Cell>
    )
  }

  renderRow(item) {
    const { fields } = this.props
    return (
      <Fragment>
        {fields.map(v => {
          const [field, opts] = v
          return this.renderField(
            item,
            field,
            item[field],
            opts
          )
        })}
      </Fragment>
    )
  }

  render() {
    const { items } = this.props
    return (
      <Table>
        {items.map((item, i) => (
          <Row
            key={`${item.id}-${i}`}
            {...styles.row}
          >
            {this.renderRow(item)}
          </Row>
        ))}
      </Table>
    )
  }
}
