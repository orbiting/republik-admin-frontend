import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import {
  colors,
  Field,
  Button,
  Label,
} from '@project-r/styleguide'
import Input from '../../Form/Input'
import DateRange from '../../Form/DateRange'
import StringArray from '../../Form/StringArray'

import CSVDownloader from './CsvDownloader'

const styles = {
  container: css({
    maxWidth: '600px',
    margin: '20px auto 40px auto',
  }),
  showMoreButton: css({
    display: 'block',
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
}

export default class TableForm extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.value || {
      search: '',
      dateRange: null,
      stringArray: null,
      showFilters: false,
    }

    this.handleToggleForm = () => {
      this.setState({
        showFilters: !this.state.showFilters,
      })
    }

    this.handleDateRange = v => {
      this.setState({
        dateRange: v,
      })
    }

    this.handleSearch = (_, value) => {
      this.setState({
        search: value,
      })
    }
    this.handleStringArray = value => {
      this.setState({
        stringArray: value,
      })
    }

    this.handleSubmit = event => {
      event.preventDefault()
      const { search, showFilters } = this.state
      this.props.onChange &&
        this.props.onChange({
          search,
          dateRange: showFilters
            ? this.state.dateRange
            : null,
          stringArray: showFilters
            ? this.state.stringArray
            : null,
        })
    }
  }

  render() {
    const {
      dateRange,
      search,
      stringArray,
      showFilters,
    } = this.state
    return (
      <form
        {...styles.container}
        onSubmit={this.handleSubmit}
      >
        <div {...styles.searchField}>
          <Field
            label="Search"
            type="text"
            value={search}
            renderInput={props => (
              <input {...props} autoFocus />
            )}
            onChange={this.handleSearch}
          />
          <Button type="submit">Go!</Button>
        </div>
        <Label
          onClick={this.handleToggleForm}
          {...styles.showMoreButton}
        >
          {showFilters
            ? 'Show less ...'
            : 'Show more...'}
        </Label>
        {showFilters && (
          <Fragment>
            <DateRange.Form
              fields={['createdAt']}
              dateRange={dateRange}
              onChange={this.handleDateRange}
            />
            <StringArray.Form
              fields={[
                [
                  'status',
                  [
                    'WAITING',
                    'WAITING_FOR_REFUND',
                    'PAID',
                    'REFUNDED',
                    'CANCELLED',
                  ],
                ],
                [
                  'method',
                  [
                    'STRIPE',
                    'POSTFINANCECARD',
                    'PAYPAL',
                    'PAYMENTSLIP',
                  ],
                ],
              ]}
              value={stringArray}
              onChange={this.handleStringArray}
            />
          </Fragment>
        )}
      </form>
    )
  }
}
