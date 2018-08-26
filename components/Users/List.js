import React, { Component } from 'react'
import gql from 'graphql-tag'
import {
  Spinner,
  Label,
} from '@project-r/styleguide'

import routes from '../../server/routes'
const { Link } = routes

import ErrorMessage from '../ErrorMessage'
import TableBody from '../Form/TableBody'
import TableHead from '../Form/TableHead'
import FilterForm from '../Form/FilterForm'
import ConnectedList from '../ConnectedList'

const displayDate = rawDate => {
  const date = new Date(rawDate)
  return `${date.getDate()}.${date.getMonth() +
    1}.${date.getFullYear()}`
}

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

const renderTableField = fieldName => {
  switch (fieldName) {
    case 'createdAt':
      return ({ value }) => (
        <Label>{displayDate(value)}</Label>
      )
    case 'options':
      return ({ item: user }) => (
        <Link
          route="user"
          params={{ userId: user.id }}
        >
          <a style={{ cursor: 'pointer' }}>
            Zum User
          </a>
        </Link>
      )
  }
}

export default class UsersList extends Component {
  render() {
    return (
      <ConnectedList
        enforceSearch
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
                  renderField={renderTableField}
                />
              ) : null}
            </div>
          )
        }}
      </ConnectedList>
    )
  }
}
