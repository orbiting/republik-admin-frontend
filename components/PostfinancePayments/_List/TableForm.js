import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import {
  Field,
  Label,
  Button,
} from '@project-r/styleguide'

import DateRange from '../../Form/DateRange'
import Boolean from '../../Form/Boolean'

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
      dateRange: null,
      search: '',
      boolean: null,
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

    this.handleBoolean = v => {
      this.setState({
        boolean: v,
      })
    }
    this.handleSearch = (_, v) => {
      this.setState({
        search: v,
      })
    }

    this.handleSubmit = event => {
      event.preventDefault()
      const {
        search,

        showFilters,
      } = this.state
      this.props.onChange &&
        this.props.onChange({
          search,
          boolean: showFilters
            ? this.state.boolean
            : null,
          dateRange: showFilters
            ? this.state.dateRange
            : null,
        })
    }
  }

  render() {
    const { showFilters } = this.state
    return (
      <form
        {...styles.container}
        onSubmit={this.handleSubmit}
      >
        <div {...styles.searchField}>
          <Field
            label="Search"
            type="text"
            value={this.state.search}
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
              fields={[
                'buchungsdatum',
                'valuta',
                'createdAt',
              ]}
              value={this.state.dateRange}
              onChange={this.handleDateRange}
            />
            <Boolean.Form
              fields={['matched']}
              value={this.state.boolean}
              onChange={this.handleBoolean}
            />
          </Fragment>
        )}
      </form>
    )
  }
}
