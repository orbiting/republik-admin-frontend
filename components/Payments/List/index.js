import React from 'react'
import gql from 'graphql-tag'
import ErrorMessage from '../../ErrorMessage'
import ConnectedList from '../../ConnectedList'
import { Spinner } from '@project-r/styleguide'

import TableForm from './TableForm'
import TableHead from './TableHead'
import TableBody from './TableBody'

const PAYMENTS_LIMIT = 200

const GET_PAYMENTS = gql`
  query payments(
    $limit: Int!
    $offset: Int
    $orderBy: OrderBy
    $search: String
    $dateRange: DateRangeFilter
    $stringArray: StringArrayFilter
  ) {
    payments(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      dateRangeFilter: $dateRange
      stringArrayFilter: $stringArray
      search: $search
    ) {
      count
      items {
        id
        method
        dueDate
        paperInvoice
        total
        status
        hrid
        user {
          id
        }
        createdAt
        updatedAt
      }
    }
  }
`
export default () => (
  <ConnectedList
    query={GET_PAYMENTS}
    limit={PAYMENTS_LIMIT}
    namespace={'payments'}
  >
    {({
      formValue,
      // disabledFilters,
      loading,
      error,
      items,
      handleChange,
      // toggleField,
    }) => {
      const {
        search,
        dateRange,
        orderBy,
        stringArray,
      } = formValue
      return (
        <div>
          <TableForm
            value={{
              search,
              dateRange,
              stringArray,
            }}
            onChange={handleChange}
          />
          {items && (
            <TableHead
              sort={orderBy}
              onSort={v =>
                handleChange({ orderBy: v })
              }
            />
          )}
          {error ? (
            <ErrorMessage error={error} />
          ) : loading ? (
            <div style={{ height: 100 }}>
              <Spinner />
            </div>
          ) : items ? (
            <TableBody items={items} />
          ) : null}
        </div>
      )
    }}
  </ConnectedList>
)
