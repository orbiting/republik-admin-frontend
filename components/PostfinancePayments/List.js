import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Spinner } from '@project-r/styleguide'
import ConnectedList from '../ConnectedList'
import ErrorMessage from '../ErrorMessage'
import FilterForm from '../Form/FilterForm'

import TableHead from '../Form/TableHead'
import TableBody from '../Form/TableBody'

const GET_POSTFINANCE_PAYMENTS = gql`
  query postfinancePayments(
    $limit: Int!
    $offset: Int
    $orderBy: OrderBy
    $dateRange: DateRangeFilter
    $search: String
    $bool: BooleanFilter
  ) {
    postfinancePayments(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      dateRangeFilter: $dateRange
      search: $search
      booleanFilter: $bool
    ) {
      count
      items {
        id
        hidden
        buchungsdatum
        valuta
        avisierungstext
        gutschrift
        mitteilung
        matched
        createdAt
        updatedAt
      }
    }
  }
`

const POSTFINANCE_PAYMENTS_LIMIT = 200

const filters = {
  dateRange: [
    'buchungsdatum',
    'valuta',
    'createdAt',
  ],
  boolean: ['matched'],
}

const table = [
  [
    'buchungsdatum',
    {
      width: '10%',
      orderable: true,
      label: 'Buchungsdatum',
    },
  ],
  [
    'valuta',
    {
      width: '10%',
      orderable: true,
      label: 'Valuta',
    },
  ],
  [
    'avisierungstext',
    {
      width: '30%',
      orderable: true,
      label: 'Avisierungstext',
    },
  ],
  [
    'gutschrift',
    {
      width: '30%',
      orderable: true,
      label: 'Gutschrift',
    },
  ],
  [
    'mitteilung',
    {
      width: '10%',
      label: 'Mitteilung',
    },
  ],
  [
    'matched',
    {
      width: '10%',
      orderable: true,
      label: 'Matched',
    },
  ],
  [
    'createdAt',
    {
      width: '10%',
      orderable: true,
      label: 'Created',
    },
  ],
]

export default class PostfinanPaymentsList extends Component {
  render() {
    return (
      <ConnectedList
        query={GET_POSTFINANCE_PAYMENTS}
        limit={POSTFINANCE_PAYMENTS_LIMIT}
        namespace={'postfinancePayments'}
      >
        {({
          filterValues,
          orderBy,
          disabledFilters,
          loading,
          error,
          items,
          handleFilter,
          handleOrderBy,
          handleToggleFilter,
        }) => {
          return (
            <div>
              <FilterForm
                filters={filters}
                value={filterValues}
                onToggleFilter={
                  handleToggleFilter
                }
                disabled={disabledFilters}
                onSubmit={handleFilter}
              />
              {items && (
                <TableHead
                  fields={table}
                  value={orderBy}
                  onChange={handleOrderBy}
                />
              )}
              {error ? (
                <ErrorMessage error={error} />
              ) : loading ? (
                <div style={{ height: 100 }}>
                  <Spinner />
                </div>
              ) : items ? (
                <TableBody
                  fields={table}
                  items={items}
                />
              ) : null}
            </div>
          )
        }}
      </ConnectedList>
    )
  }
}
