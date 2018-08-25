import React, { Component } from 'react'
import { css } from 'glamor'
import {
  Field,
  Label,
  Button,
} from '@project-r/styleguide'

import DateRange from '../../Form/DateRange'

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

    this.handleSubmit = event => {
      event.preventDefault()
      const { search, showFilters } = this.state
      this.props.onChange &&
        this.props.onChange({
          search,
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
            isFocused={true}
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
          <DateRange.Form
            fields={['createdAt']}
            value={this.state.dateRange}
            onChange={this.handleDateRange}
          />
        )}
      </form>
    )
  }
}
