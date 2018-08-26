import React from 'react'
import gql from 'graphql-tag'
import {
  Spinner,
  Label,
  colors,
} from '@project-r/styleguide'

import { chfFormat } from '../../lib/utils/formats'

import routes from '../../server/routes'
const { Link } = routes

import ErrorMessage from '../ErrorMessage'
import ConnectedList from '../ConnectedList'
import TableHead from '../Form/TableHead'
import TableBody from '../Form/TableBody'
import FilterForm from '../Form/FilterForm'

const displayDate = rawDate => {
  const date = new Date(rawDate)
  return `${date.getDate()}.${date.getMonth() +
    1}.${date.getFullYear()}`
}

const getDueDate = (status, dueDate) => {
  if (!dueDate) {
    return '-'
  } else if (
    new Date(dueDate) < new Date() &&
    status !== 'PAID'
  ) {
    return (
      <span
        style={{
          color: colors.error,
          fontWeight: 'bold',
        }}
      >
        {displayDate(dueDate)}
      </span>
    )
  }
  return displayDate(dueDate)
}

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

const table = [
  [
    'hrid',
    {
      width: '10%',
      label: 'HR-ID',
      orderable: true,
    },
  ],
  [
    'total',
    {
      width: '10%',
      label: 'Total',
      orderable: true,
    },
  ],
  [
    'status',
    {
      width: '20%',
      label: 'Status',
      orderable: true,
    },
  ],
  [
    'dueDate',
    {
      width: '10%',
      label: 'Due date',
      orderable: true,
    },
  ],
  [
    'method',
    {
      width: '20%',
      label: 'Method',
      orderable: true,
    },
  ],
  [
    'createdAt',
    {
      width: '10%',
      label: 'Created',
      orderable: true,
    },
  ],
  [
    'options',
    {
      width: '5%',
      label: 'Detail',
      orderable: true,
    },
  ],
]

const renderTableField = fieldName => {
  switch (fieldName) {
    case 'createdAt':
      return ({ value }) => (
        <Label>{displayDate(value)}</Label>
      )
    case 'total':
      return ({ value }) => (
        <Label>{chfFormat(value)}</Label>
      )
    case 'dueDate':
      return ({ item: payment }) => (
        <Label>
          {getDueDate(
            payment.status,
            payment.dueDate
          )}
        </Label>
      )
    case 'options':
      return ({ item: payment }) =>
        payment.user && (
          <Link
            route="user"
            params={{ userId: payment.user.id }}
          >
            <a style={{ cursor: 'pointer' }}>
              Zum User
            </a>
          </Link>
        )
  }
}

export default () => (
  <ConnectedList
    query={GET_PAYMENTS}
    limit={PAYMENTS_LIMIT}
    namespace={'payments'}
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
            onToggleFilter={handleToggleFilter}
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
              renderField={renderTableField}
              items={items}
              fields={table}
            />
          ) : null}
        </div>
      )
    }}
  </ConnectedList>
)
