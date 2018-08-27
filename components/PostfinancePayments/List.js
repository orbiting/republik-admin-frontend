import React, { Component } from 'react'
import gql from 'graphql-tag'
import {
  Spinner,
  Label,
} from '@project-r/styleguide'
import { css } from 'glamor'
import { chfFormat } from '../../lib/utils/formats'
import ErrorMessage from '../ErrorMessage'

import { withToggle } from '../Form/toggle'
import {
  TableView,
  TableHead,
  TableBody,
  FilterForm,
} from '../TableView'
import tableViewStyles from '../TableView/styles'

import MessageField from './MessageField'
import Options from './Options'
import CSVImport from './CSVImport'
import Rematch from './Rematch'

const displayDate = rawDate => {
  const date = new Date(rawDate)
  return `${date.getDate()}.${date.getMonth() +
    1}.${date.getFullYear()}`
}

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
      width: '10%',
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
  [
    'options',
    {
      width: '10%',
      label: 'Options',
    },
  ],
]

const renderTableField = fieldName => {
  switch (fieldName) {
    case 'createdAt':
      return ({ value }) => displayDate(value)
    case 'gutschrift':
      return ({ value }) => chfFormat(value / 100)
    case 'avisierungstext':
      return ({ value }) => (
        <Label
          {...css({
            whiteSpace: 'pre-line',
            padding: '3px',
          })}
        >
          {value
            .split(/mitteilungen:\s?/i)
            .join('\nMitteilungen:\n')}
        </Label>
      )
    case 'matched':
      return ({ value }) => (value ? 'Yes' : 'No')
  }
}

const Actions = withToggle({
  namespace: 'showPostfinancePaymentActions',
})(({ isToggled, toggle, children }) => {
  return (
    <div {...tableViewStyles.formContainer}>
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

export default class PostfinancePaymentsList extends Component {
  render() {
    return (
      <TableView
        query={GET_POSTFINANCE_PAYMENTS}
        limit={POSTFINANCE_PAYMENTS_LIMIT}
        namespace={'postfinancePayments'}
      >
        {({
          loading,
          error,
          refetch,
          filterValues,
          orderBy,
          disabledFilters,
          items,
          updateFilters,
          updateOrderBy,
          toggleFilter,
        }) => {
          const innerRenderTableField = fieldName => {
            switch (fieldName) {
              case 'mitteilung':
                return ({ item }) => (
                  <MessageField
                    postfinancePayment={item}
                    refetchQueries={refetch}
                  />
                )
              case 'options':
                return ({ item }) => (
                  <Options
                    postfinancePayment={item}
                    refetchQueries={refetch}
                  />
                )
              default:
                return renderTableField(fieldName)
            }
          }
          return (
            <div>
              <FilterForm
                filters={filters}
                value={filterValues}
                onToggleFilter={toggleFilter}
                disabled={disabledFilters}
                onSubmit={updateFilters}
              />
              <Actions>
                <CSVImport />
                <Rematch />
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
                  renderField={
                    innerRenderTableField
                  }
                  fields={table}
                  items={items.filter(
                    v => !v.hidden
                  )}
                />
              ) : null}
            </div>
          )
        }}
      </TableView>
    )
  }
}
