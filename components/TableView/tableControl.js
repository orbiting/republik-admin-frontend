import { compose } from 'redux'
import { connect } from 'react-redux'

export const TOGGLE_FILTER = 'TOGGLE_FILTER'
export const UPDATE_FILTERS = 'UPDATE_FILTERS'
export const UPDATE_ORDER_BY = 'UPDATE_ORDER_BY'

export const createToggleFilter = namespace => (
  filterType,
  value
) => ({
  type: TOGGLE_FILTER,
  namespace,
  payload: {
    filterType,
    value,
  },
})

export const createUpdateFilters = namespace => value => ({
  type: UPDATE_FILTERS,
  namespace,
  payload: value,
})

export const createUpdateOrderBy = namespace => value => ({
  type: UPDATE_ORDER_BY,
  namespace,
  payload: value,
})

const initialState = {
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

export const reducer = (
  rootState = {},
  { type, namespace, payload }
) => {
  const state =
    rootState[namespace] || initialState

  switch (type) {
    case TOGGLE_FILTER:
      return {
        ...rootState,
        [namespace]: {
          ...state,
          disabledFilters: {
            ...state.disabledFilters,
            [payload.filterType]: payload.value,
          },
        },
      }
    case UPDATE_FILTERS:
      return {
        ...rootState,
        [namespace]: {
          ...state,
          filterValues: {
            ...state.filterValues,
            ...payload,
          },
        },
      }
    case UPDATE_ORDER_BY:
      return {
        ...state,
        [namespace]: {
          ...state,
          orderBy: {
            ...state.orderBy,
            ...payload,
          },
        },
      }
    default:
      return state
  }
}

const mapStateToProps = (
  { tableControl },
  { namespace }
) => {
  const state =
    tableControl[namespace] || initialState
  return {
    filterValues: state.filterValues,
    orderBy: state.orderBy,
    disabledFilters: state.disabledFilters,
  }
}

const mapDispatchToProps = (
  dispatch,
  { namespace }
) => ({
  toggleFilter: compose(
    dispatch,
    createToggleFilter(namespace)
  ),
  updateFilters: compose(
    dispatch,
    createUpdateFilters(namespace)
  ),
  updateOrderBy: compose(
    dispatch,
    createUpdateOrderBy(namespace)
  ),
})

export const withTableControl = connect(
  mapStateToProps,
  mapDispatchToProps
)
