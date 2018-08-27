import React, { Component } from 'react'
import {
  Label,
  Checkbox,
  Dropdown,
  Field,
} from '@project-r/styleguide'

import styles from './styles'

export default class StringArrayFilter extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.value || {
      field: props.fields[0][0],
      values: [],
    }

    this.handleSelectedField = event => {
      const value = event.target.value
      this.setState(
        () => ({
          field: value,
          values: [],
        }),
        this.emitChange
      )
    }
    this.handleChoice = event => {
      const {
        name: value,
        checked,
      } = event.target
      const oldValues = this.state.values
      const cleanValues = oldValues.filter(
        v => v !== value
      )
      const values = checked
        ? [value, ...cleanValues]
        : cleanValues
      this.setState(
        () => ({
          values,
        }),
        this.emitChange
      )
    }
    this.emitChange = () => {
      if (this.props.onChange) {
        const { field, values } = this.state
        this.props.onChange(
          values.length > 0
            ? {
                field,
                values,
              }
            : undefined
        )
      }
    }
  }

  render() {
    const { fields, disabled } = this.props
    const { field, values } = this.state
    const selectedField = fields.find(
      v => v && v[0] === field
    )
    return (
      <div {...styles.formSection}>
        <Label {...styles.filterTitle}>
          Filter by enum
        </Label>
        <div {...styles.hBox}>
          <div {...styles.cellOne}>
            {fields.length > 1 && !disabled ? (
              <Dropdown.Native
                label={'Column'}
                value={field}
                disabled={disabled}
                items={fields.map(value => ({
                  value: value[0],
                  text: value[0],
                }))}
                onChange={
                  this.handleSelectedField
                }
              />
            ) : (
              <Field
                label={'Column'}
                value={field}
                renderInput={props => (
                  <input
                    type="text"
                    disabled
                    {...props}
                    {...disabled &&
                      styles.disabledFilter}
                  />
                )}
              />
            )}
          </div>
          <div {...styles.cellTwo}>
            <Label {...styles.statusLabel}>
              Status
            </Label>
            <div {...styles.vBox}>
              {selectedField
                ? selectedField[1].map(choice => (
                    <Checkbox
                      disabled={disabled}
                      key={choice}
                      name={choice}
                      checked={
                        values.indexOf(choice) >=
                        0
                      }
                      onChange={this.handleChoice}
                    >
                      {choice}
                    </Checkbox>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
