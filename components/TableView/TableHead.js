import React, { Component, Fragment } from 'react'
import Sticky from 'react-sticky-el'
import { Label } from '@project-r/styleguide'
import { Table, Row, Cell } from '../Layout/Table'
import SortIndicator from './SortIndicator'

import styles from './styles'

export default class TabledHead extends Component {
  createHandleOrderBy(field) {
    const { value, onChange } = this.props
    if (!value || value.field !== field) {
      return () =>
        onChange({
          field: field,
          direction: 'ASC',
        })
    } else {
      return () =>
        onChange({
          field: value.field,
          direction:
            value.direction === 'ASC'
              ? 'DESC'
              : 'ASC',
        })
    }
  }

  renderSortIndicator(field) {
    const { value } = this.props
    if (value && value.field === field) {
      return (
        <SortIndicator
          sortDirection={value.direction}
        />
      )
    } else {
      return null
    }
  }

  renderInner({ label, sortIndicator }) {
    return (
      <Label>
        {label} {sortIndicator}
      </Label>
    )
  }

  renderField(field, opts) {
    const { renderField } = this.props
    const { label, width, orderable } = opts

    const cellProps = {
      ...(styles.interactive || {}),
      onClick:
        orderable &&
        this.createHandleOrderBy(field),
      flex: `0 0 ${width}`,
    }

    const innerProps = {
      label,
      sortIndicator: this.renderSortIndicator(
        field
      ),
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

  renderFields() {
    const { fields } = this.props
    return (
      <Fragment>
        {fields.map(v => {
          const [field, opts] = v
          return this.renderField(field, opts)
        })}
      </Fragment>
    )
  }

  render() {
    return (
      <Sticky scrollElement="#content">
        <Table>
          <Row {...styles.thead}>
            {this.renderFields()}
          </Row>
        </Table>
      </Sticky>
    )
  }
}
