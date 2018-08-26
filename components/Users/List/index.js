import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Spinner } from '@project-r/styleguide'

import ErrorMessage from '../../ErrorMessage'
import TableBody from '../../Form/TableBody'
import TableHead from '../../Form/TableHead'
import FilterForm from '../../Form/FilterForm'
import ConnectedList from '../../ConnectedList'

const USERS_LIMIT = 200

const GET_USERS = gql`
  query users(
    $limit: Int!
    $offset: Int
    $orderBy: OrderBy
    $search: String
    $dateRange: DateRangeFilter
  ) {
    users: adminUsers(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      dateRangeFilter: $dateRange
      search: $search
    ) {
      count
      items {
        id
        name
        email
        firstName
        lastName
        createdAt
        updatedAt
      }
    }
  }
`

const filters = {
  dateRange: ['createdAt'],
}

const table = [
  [
    'email',
    {
      width: '40%',
      orderable: true,
      label: 'Email',
    },
  ],
  [
    'firstName',
    {
      width: '20%',
      orderable: true,
      label: 'First name',
    },
  ],
  [
    'lastName',
    {
      width: '20%',
      orderable: true,
      label: 'Last name',
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
  ['options', { width: '10%', label: 'Detail' }],
]

export default class UsersList extends Component {
  render() {
    return (
      <ConnectedList
        query={GET_USERS}
        limit={USERS_LIMIT}
        namespace={'users'}
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
