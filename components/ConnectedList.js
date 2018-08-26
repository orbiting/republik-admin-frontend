import React, { Component } from 'react'
import { Query } from 'react-apollo'
import InfiniteScroller from 'react-infinite-scroller'

export default class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      disabledFilters: {
        dateRange: true,
        stringArray: true,
        boolean: true,
      },
      orderBy: null,
      filterValues: {
        search: '',
        dateRange: null,
        stringArray: null,
        boolean: null,
      },
    }

    this.handleToggleFilter = name =>
      this.setState({
        disabledFilters: {
          ...this.state.disabledFilters,
          [name]: !this.state.disabledFilters[
            name
          ],
        },
      })

    this.handleFilter = value =>
      this.setState({
        filterValues: {
          ...this.state.filterValues,
          ...value,
        },
      })

    this.handleOrderBy = value =>
      this.setState({
        orderBy: value,
      })

    this.updateQuery = (
      previousResult,
      { fetchMoreResult }
    ) => {
      if (!fetchMoreResult) {
        return previousResult
      }
      return {
        ...previousResult,
        ...{
          [this.props.namespace]: {
            ...previousResult[
              this.props.namespace
            ],
            ...fetchMoreResult[
              this.props.namespace
            ],
            items: [
              ...previousResult[
                this.props.namespace
              ].items,
              ...fetchMoreResult[
                this.props.namespace
              ].items,
            ],
          },
        },
      }
    }
  }

  render() {
    const {
      query,
      limit,
      namespace,
      enforceSearch,
      children,
    } = this.props

    const {
      filterValues,
      filterValues: {
        dateRange,
        search,
        stringArray,
        boolean,
      },
      orderBy,
      disabledFilters,
    } = this.state

    return (
      <Query
        query={query}
        skip={enforceSearch && !search}
        variables={{
          limit: limit,
          offset: 0,
          search,
          orderBy,
          dateRange: !disabledFilters.dateRange
            ? dateRange
            : null,
          stringArray: !disabledFilters.stringArray
            ? stringArray
            : null,
          boolean: !disabledFilters.boolean
            ? boolean
            : null,
        }}
      >
        {({
          data,
          loading,
          error,
          networkStatus,
          refetch,
          fetchMore,
        }) => {
          const { items, count } =
            (data && data[namespace]) || {}
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
                  updateQuery: this.updateQuery,
                })
              }}
              hasMore={
                items && !isLoading
                  ? count > items.length
                  : false
              }
              useWindow={false}
            >
              {children({
                data,
                loading: isLoading,
                error,
                refetch,
                // Non apollo
                items,
                filterValues,
                orderBy,
                disabledFilters,
                handleFilter: this.handleFilter,
                handleToggleFilter: this
                  .handleToggleFilter,
                handleOrderBy: this.handleOrderBy,
              })}
            </InfiniteScroller>
          )
        }}
      </Query>
    )
  }
}
