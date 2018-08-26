import React, { Component, Fragment } from 'react'
import { css } from 'glamor'
import {
  Field,
  Button,
  Label,
  Checkbox,
} from '@project-r/styleguide'

import DateRange from './DateRange'
import StringArray from './StringArray'
import Boolean from './Boolean'

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
  toggleDisplay: css({
    position: 'relative',
  }),
  toggleInput: css({
    position: 'absolute',
    left: '-20px',
  }),
}

export default class TableForm extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.value || {
      search: '',
      dateRange: null,
      stringArray: null,
      boolean: null,
      showFilters: false,
    }

    this.handleToggleForm = () => {
      this.setState({
        showFilters: !this.state.showFilters,
      })
    }

    this.handleSearch = (_, value) => {
      this.setState({
        search: value,
      })
    }

    this.handleFilter = filterType => v => {
      this.setState({
        [filterType]: v,
      })
    }

    this.handleSubmit = event => {
      event.preventDefault()
      const {
        search,
        dateRange,
        stringArray,
        boolean,
      } = this.state
      this.props.onSubmit &&
        this.props.onSubmit({
          search,
          dateRange,
          stringArray,
          boolean,
        })
    }
  }

  renderToggleDisplay(filterType, filter) {
    const {
      disabled,
      onToggleFilter,
    } = this.props
    return (
      <div
        key={filterType}
        {...styles.toggleDisplay}
      >
        <span {...styles.toggleInput}>
          <Checkbox
            checked={!disabled[filterType]}
            onChange={(_, v) =>
              onToggleFilter &&
              onToggleFilter(filterType, v)
            }
          />
        </span>
        {filter}
      </div>
    )
  }

  renderFilters() {
    const { filters } = this.props
    return Object.keys(filters).map(
      filterType => {
        const filterFieldProps = {
          fields: filters[filterType],
          value: this.state[filterType],
          onChange: this.handleFilter(filterType),
        }
        let FilterField
        switch (filterType) {
          case 'dateRange':
            FilterField = DateRange.Form
            break
          case 'stringArray':
            FilterField = StringArray.Form
            break
          case 'boolean':
            FilterField = Boolean.Form
            break
          default:
            return (
              <div>
                Unknown filter {filterType}
              </div>
            )
        }
        return this.renderToggleDisplay(
          filterType,
          <FilterField {...filterFieldProps} />
        )
      }
    )
  }

  render() {
    const { searchLabel } = this.props
    const { search, showFilters } = this.state
    return (
      <form
        {...styles.container}
        onSubmit={this.handleSubmit}
      >
        <div {...styles.searchField}>
          <Field
            type="text"
            value={search}
            renderInput={props => (
              <input
                {...props}
                autoFocus
                placeholder={searchLabel}
              />
            )}
            onChange={this.handleSearch}
          />
        </div>
        <Label
          onClick={this.handleToggleForm}
          {...styles.showMoreButton}
        >
          {showFilters
            ? 'Hide filters ...'
            : 'Show filters ...'}
        </Label>
        {showFilters && (
          <Fragment>
            {this.renderFilters()}
            <Button type="submit">Go!</Button>
          </Fragment>
        )}
      </form>
    )
  }
}
