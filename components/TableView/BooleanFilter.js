import React, { Component } from 'react'
import {
  Dropdown,
  Label,
  Field,
  Checkbox,
} from '@project-r/styleguide'
import styles from './styles'

export default class BooleanFilter extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.value || {
      field: this.props.fields[0],
      value: false,
    }
    this.handleSelectedField = event => {
      this.setState(
        () => ({
          field: event.target.value,
        }),
        this.emitChange
      )
    }
  }

  handleChange = (_, value) => {
    this.setState(
      () => ({
        value,
      }),
      this.emitChange
    )
  }

  emitChange = () => {
    if (this.props.onChange) {
      const { field, value } = this.state
      this.props.onChange({
        field,
        value,
      })
    }
  }

  render() {
    const { fields, disabled } = this.props
    const { field, value } = this.state

    return (
      <div {...styles.formSection}>
        <Label {...styles.filterTitle}>
          Filter by status
        </Label>
        <div {...styles.hBox}>
          <div {...styles.cellOne}>
            {fields.length > 1 && !disabled ? (
              <Dropdown.Native
                label={'Column'}
                value={field}
                disabled={disabled}
                items={fields.map(v => ({
                  value: v[0],
                  text: v[0],
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
              <Checkbox
                name={field}
                checked={value}
                disabled={disabled}
                onChange={this.handleChange}
              >
                {'Set to true'}
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
