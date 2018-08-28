import React from 'react'

import {
  InlineSpinner,
  Label,
} from '@project-r/styleguide'

import { tableView as tableViewStyles } from '../styles'

import ErrorMessage from '../ErrorMessage'

export default ({
  items,
  count,
  error,
  loading,
}) => {
  return (
    <div {...tableViewStyles.tableInfo}>
      {(items &&
        (loading && (
          <InlineSpinner size="38px" />
        ))) ||
        (error && <ErrorMessage error={error} />)}
      {items &&
        count && (
          <Label>
            Showing {items.length} of {count}{' '}
            results.
          </Label>
        )}
    </div>
  )
}
