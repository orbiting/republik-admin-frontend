import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Spinner } from '@project-r/styleguide'

import ErrorMessage from '../../ErrorMessage'
import TableForm from './TableForm'
import TableHead from './TableHead'
import TableBody from './TableBody'
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

export default class UsersList extends Component {
  render() {
    return (
      <ConnectedList
        query={GET_USERS}
        limit={USERS_LIMIT}
        namespace={'users'}
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
          } = formValue
          return (
            <div>
              <TableForm
                value={{ search, dateRange }}
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
  }
}
