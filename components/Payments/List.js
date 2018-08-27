import React from 'react'
import gql from 'graphql-tag'
import {
  Spinner,
  A,
  colors,
  Label,
} from '@project-r/styleguide'

import { chfFormat } from '../../lib/utils/formats'

import routes from '../../server/routes'
const { Link } = routes

import ErrorMessage from '../ErrorMessage'

import {
  TableView,
  TableHead,
  TableBody,
  FilterForm,
} from '../TableView'
import tableViewStyles from '../TableView/styles'
import { withToggle } from '../Form/toggle'

import CSVDownloader from './CSVDownloader'

const displayDate = rawDate => {
  const date = new Date(rawDate)
  return `${date.getDate()}.${date.getMonth() +
    1}.${date.getFullYear()}`
}

const getDueDate = (status, dueDate) => {
  if (!dueDate) {
    return <span>-</span>
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
      width: '15%',
      label: 'Total',
      orderable: true,
    },
  ],
  [
    'status',
    {
      width: '10%',
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
      width: '10%',
      label: 'Detail',
      orderable: true,
    },
  ],
]

const Actions = withToggle({
  namespace: 'showPaymentActions',
})(({ isToggled, toggle, children }) => {
  return (
    <div {...tableViewStyles.form}>
      <Label
        onClick={toggle}
        {...tableViewStyles.interactive}
      >
        {isToggled
          ? 'Hide actions ...'
          : 'Show actions ...'}
      </Label>
      {isToggled && children}
    </div>
  )
})

const renderTableField = fieldName => {
  switch (fieldName) {
    case 'createdAt':
      return ({ value }) => displayDate(value)
    case 'total':
      return ({ value }) => chfFormat(value)

    case 'dueDate':
      return ({ item: payment }) =>
        getDueDate(
          payment.status,
          payment.dueDate
        )
    case 'options':
      return ({ item: payment }) =>
        payment.user && (
          <Link
            route="user"
            params={{ userId: payment.user.id }}
          >
            <A style={{ cursor: 'pointer' }}>
              Zum User
            </A>
          </Link>
        )
  }
}

export default () => (
  <TableView
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
      updateFilters,
      updateOrderBy,
      toggleFilter,
    }) => {
      return (
        <div>
          <FilterForm
            searchLabel="Search for payments..."
            namespace={'showPaymentFilters'}
            filters={filters}
            value={filterValues}
            onToggleFilter={toggleFilter}
            disabled={disabledFilters}
            onSubmit={updateFilters}
          />
          <Actions>
            <CSVDownloader />
          </Actions>
          {items && (
            <TableHead
              fields={table}
              value={orderBy}
              onChange={updateOrderBy}
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
  </TableView>
)
