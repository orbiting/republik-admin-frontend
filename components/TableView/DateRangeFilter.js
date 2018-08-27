import React, { Component } from 'react'
import {
  Field,
  Dropdown,
  Label,
} from '@project-r/styleguide'
import moment from 'moment'

import { tableView as styles } from '../styles'

const standardDate = rawDate =>
  moment(rawDate).format('YYYY-MM-DD')

const localDate = rawDate =>
  moment(rawDate).format('YYYY-MM-DD')

export default class DateRangeFilter extends Component {
  constructor(props) {
    super(props)

    this.state = this.props.dateRange || {
      field: this.props.fields[0],
      from: standardDate('2017-04-20'),
      to: standardDate({}),
    }

    this.handleSelectedField = event => {
      const value = event.target.value
      this.setState(
        () => ({
          field: value,
        }),
        this.emitChange
      )
    }
    this.handleStartDate = event => {
      const value = event.target.value
      this.setState(
        () => ({
          from: value,
        }),
        this.emitChange
      )
    }

    this.handleEndDate = event => {
      const value = event.target.value
      this.setState(
        () => ({
          to: value,
        }),
        this.emitChange
      )
    }

    this.emitChange = () => {
      if (this.props.onChange) {
        const { field, from, to } = this.state
        this.props.onChange({
          field,
          from: localDate(from),
          to: localDate(to),
        })
      }
    }
  }

  render() {
    const { fields, disabled } = this.props
    const { field, from, to } = this.state

    return (
      <div {...styles.formSection}>
        <Label {...styles.filterTitle}>
          Filter by date
        </Label>
        <div {...styles.hBox}>
          <div {...styles.cell}>
            {fields.length > 1 && !disabled ? (
              <Dropdown.Native
                label={'Column'}
                value={field}
                items={fields.map(value => ({
                  value,
                  text: value,
                }))}
                disabled={disabled}
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
          <div {...styles.cell}>
            <Field
              name="startDate"
              label="From"
              value={from}
              type="date"
              renderInput={props => (
                <input
                  type="date"
                  disabled={disabled}
                  {...props}
                  {...disabled &&
                    styles.disabledFilter}
                />
              )}
              onChange={this.handleStartDate}
            />
          </div>
          <div {...styles.cell}>
            <Field
              name="endDate"
              label="Until"
              value={to}
              type="date"
              renderInput={props => (
                <input
                  type="date"
                  disabled={disabled}
                  {...disabled &&
                    styles.disabledFilter}
                  {...props}
                />
              )}
              onChange={this.handleEndDate}
            />
          </div>
        </div>
      </div>
    )
  }
}
