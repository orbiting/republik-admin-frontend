import React from 'react'
import { Query } from 'react-apollo'
import InfiniteScroller from 'react-infinite-scroller'
import { withTableControl } from './tableControl'

const createUpdateQuery = namespace => (
  previousResult,
  { fetchMoreResult }
) => {
  if (!fetchMoreResult) {
    return previousResult
  }
  return {
    ...previousResult,
    ...{
      [namespace]: {
        ...previousResult[namespace],
        ...fetchMoreResult[namespace],
        items: [
          ...previousResult[namespace].items,
          ...fetchMoreResult[namespace].items,
        ],
      },
    },
  }
}

const List = props => {
  const {
    query,
    limit,
    namespace,
    enforceSearch,
    filterValues,
    filterValues: {
      dateRange,
      search,
      stringArray,
      boolean,
    },
    orderBy,
    disabledFilters,
    updateFilters,
    toggleFilter,
    updateOrderBy,
    children,
  } = props
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
        bool: !disabledFilters.boolean
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
                    (items && items.length) || 0,
                },
                updateQuery: createUpdateQuery(
                  namespace
                ),
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
              count,
              filterValues,
              orderBy,
              disabledFilters,
              updateFilters,
              toggleFilter,
              updateOrderBy,
            })}
          </InfiniteScroller>
        )
      }}
    </Query>
  )
}

export default withTableControl(List)
