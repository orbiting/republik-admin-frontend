import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from '../../ErrorMessage'
import InfiniteScroller from 'react-infinite-scroller'

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

const updatePaymentsQuery = (
  previousResult,
  { fetchMoreResult }
) => {
  if (!fetchMoreResult) {
    return previousResult
  }
  return {
    ...previousResult,
    ...{
      payments: {
        ...previousResult.users,
        ...fetchMoreResult.users,
        items: [
          ...previousResult.users.items,
          ...fetchMoreResult.users.items,
        ],
      },
    },
  }
}

export default class Payments extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
      dateRange: null,
      orderBy: null,
      stringArray: null,
    }

    this.handleForm = v => this.setState(v)
    this.handleSort = v =>
      this.setState({ orderBy: v })
  }

  render() {
    const {
      orderBy,
      dateRange,
      search,
      stringArray,
    } = this.state

    return (
      <Query
        query={GET_PAYMENTS}
        skip={!search}
        variables={{
          limit: PAYMENTS_LIMIT,
          offset: 0,
          orderBy,
          dateRange,
          search,
          stringArray,
        }}
      >
        {({
          data,
          loading,
          error,
          networkStatus,
          fetchMore,
        }) => {
          const { items, count } =
            (data && data.payments) || {}
          const isLoading =
            (loading && networkStatus !== 1) ||
            (loading &&
              networkStatus === 1 &&
              !!search)

          return (
            <InfiniteScroller
              loadMore={() => {
                return fetchMore({
                  variables: {
                    offset:
                      (items && items.length) ||
                      0,
                  },
                  updateQuery: updatePaymentsQuery,
                })
              }}
              hasMore={
                items && !isLoading
                  ? count > items.length
                  : false
              }
              useWindow={false}
            >
              <div>
                <TableForm
                  value={{ search, dateRange }}
                  onChange={this.handleForm}
                />
                {items && (
                  <TableHead
                    sort={this.state.orderBy}
                    onSort={this.handleSort}
                  />
                )}
                {error ? (
                  <ErrorMessage error={error} />
                ) : isLoading ? (
                  <div style={{ height: 100 }}>
                    <Spinner />
                  </div>
                ) : items ? (
                  <TableBody items={items} />
                ) : null}
              </div>
            </InfiniteScroller>
          )
        }}
      </Query>
    )
  }
}
