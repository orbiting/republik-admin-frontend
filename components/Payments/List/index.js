import React from 'react'
import gql from 'graphql-tag'
import ErrorMessage from '../../ErrorMessage'
import ConnectedList from '../../ConnectedList'
import { Spinner } from '@project-r/styleguide'

import TableHead from './TableHead'
import TableBody from './TableBody'
import FilterForm from '../../Form/FilterForm'

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

const filters = {
  dateRange: ['createdAt'],
  stringArray: [
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
  ],
}

export default () => (
  <ConnectedList
    query={GET_PAYMENTS}
    limit={PAYMENTS_LIMIT}
    namespace={'payments'}
  >
    {({
      filterValues,
      disabledFilters,
      loading,
      error,
      items,
      handleChange,
      handleToggleFilter,
    }) => {
      const { orderBy } = filterValues
      return (
        <div>
          <FilterForm
            filters={filters}
            value={filterValues}
            onToggleFilter={handleToggleFilter}
            disabled={disabledFilters}
            onSubmit={handleChange}
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
