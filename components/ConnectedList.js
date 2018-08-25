import React, { Component } from 'react'
import { Query } from 'react-apollo'
import InfiniteScroller from 'react-infinite-scroller'

export default class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      disabledFilters: {
        dateRange: true,
        orderBy: true,
        stringArray: true,
        boolean: true,
      },
      formValue: {
        search: '',
        dateRange: null,
        orderBy: null,
        stringArray: null,
        boolean: null,
      },
    }

    this.toggleField = name =>
      this.setState({
        disabledFilters: {
          ...this.state.disabledFilters,
          [name]: !this.state.disabledFilters[
            name
          ],
        },
      })

    this.handleChange = value => {
      this.setState({
        formValue: {
          ...this.state.formValue,
          ...value,
        },
      })
    }

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
  }

  render() {
    const {
      formValue: {
        orderBy,
        dateRange,
        search,
        stringArray,
        boolean,
      },
      disabledFilters,
    } = this.state

    const {
      query,
      limit,
      namespace,
      children,
    } = this.props

    return (
      <Query
        query={query}
        skip={!search}
        variables={{
          limit: limit,
          offset: 0,
          search,
          orderBy: !disabledFilters.orderBy
            ? orderBy
            : null,
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
                formValue: this.state,
                disabledFilters,
                loading: isLoading,
                error,
                items,
                handleChange: this.handleChange,
                toggleField: this.toggleField,
              })}
            </InfiniteScroller>
          )
        }}
      </Query>
    )
  }
}
