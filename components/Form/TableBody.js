import React, { Component } from 'react'
import { css } from 'glamor'
import {
  Label,
  colors,
} from '@project-r/styleguide'
import { Table, Row, Cell } from '../Layout/Table'

const styles = {
  row: css({
    maxHeight: '230px',
    padding: '10px 0',
    '&:nth-child(odd)': {
      backgroundColor: colors.secondaryBg,
    },
  }),
}

export default class TableBody extends Component {
  renderInner({ value }) {
    return <Label>{value}</Label>
  }

  renderField(field, value, opts) {
    const { renderField } = this.props
    const { width } = opts

    const cellProps = {
      flex: `0 0 ${width}`,
    }

    const innerProps = {
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
      <Row {...styles.row} key={item.id}>
        {fields.map(v => {
          const [field, opts] = v
          return this.renderField(
            field,
            item[field],
            opts
          )
        })}
      </Row>
    )
  }

  render() {
    const { items } = this.props
    return (
      <Table>
        {items.map(item => {
          return this.renderRow(item)
        })}
      </Table>
    )
  }
}
