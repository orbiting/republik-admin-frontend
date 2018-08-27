import React, { Component, Fragment } from 'react'
import {
  Field,
  Button,
  Label,
  Checkbox,
} from '@project-r/styleguide'

import DateRangeFilter from './DateRangeFilter'
import StringArrayFilter from './StringArrayFilter'
import BooleanFilter from './BooleanFilter'
import { withToggle } from '../Form/toggle'

import styles from './styles'

class FilterForm extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.value || {
      search: '',
      dateRange: null,
      stringArray: null,
      boolean: null,
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
            FilterField = DateRangeFilter
            break
          case 'stringArray':
            FilterField = StringArrayFilter
            break
          case 'boolean':
            FilterField = BooleanFilter
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
    const {
      searchLabel,
      isToggled,
      toggle,
    } = this.props
    const { search } = this.state
    return (
      <form
        {...styles.formContainer}
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
          onClick={toggle}
          {...styles.interactive}
        >
          {isToggled
            ? 'Hide filters ...'
            : 'Show filters ...'}
        </Label>
        {isToggled && (
          <Fragment>
            {this.renderFilters()}
            <Button type="submit">Go!</Button>
          </Fragment>
        )}
      </form>
    )
  }
}

export default withToggle({
  namespace: 'showFilters',
})(FilterForm)
