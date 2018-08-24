import React, { Component } from 'react'
import { Query } from 'react-apollo'
import InfiniteScroller from 'react-infinite-scroller'

export default class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      disabledFields: {
        search: false,
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
        disabledFields: {
          ...this.state.disabledFields,
          [name]: !this.state.disabledFields[
            name
          ],
        },
      })
    this.handleChange = value => {
      console.log(value)
      this.setState({
        formValue: {
          ...this.state.formValue,
          ...value,
        },
      })
    }
  }

  updateQuery(
    previousResult,
    { fetchMoreResult }
  ) {
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

  render() {
    const {
      formValue: {
        orderBy,
        dateRange,
        search,
        stringArray,
        boolean,
      },
      disabledFields,
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
          orderBy: !disabledFields.orderBy
            ? orderBy
            : null,
          dateRange: !disabledFields.dateRange
            ? dateRange
            : null,
          stringArray: !disabledFields.stringArray
            ? stringArray
            : null,
          boolean: !disabledFields.boolean
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
                  updateQuery: this
                    .updateUsersQuery,
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
                disabledFields,
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
