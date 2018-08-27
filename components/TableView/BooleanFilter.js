import React, { Component } from 'react'
import {
  Dropdown,
  Label,
  Field,
  Checkbox,
  Interaction,
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
    const { fields } = this.props
    const { field, value } = this.state

    return (
      <div>
        <Interaction.P>
          Filter by status
        </Interaction.P>
        <div {...styles.container}>
          <div {...styles.hBox}>
            <div {...styles.cellOne}>
              {fields.length > 1 ? (
                <Dropdown.Native
                  label={'Column'}
                  value={field}
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
                  value={fields[0]}
                  disabled
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
                  onChange={this.handleChange}
                >
                  {'Set to true'}
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
