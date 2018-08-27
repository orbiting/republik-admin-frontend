import { compose } from 'redux'
import { connect } from 'react-redux'

export const TOGGLE = 'TOGGLE'

export const createToggle = namespace => () => ({
  type: TOGGLE,
  namespace,
})

const mapStateToProps = namespaceFromConfig => (
  { toggle: state },
  { namespace: namespaceFromProps }
) => {
  const namespace =
    namespaceFromProps || namespaceFromConfig
  return {
    isToggled: state[namespace],
  }
}

const mapDispatchToProps = namespaceFromConfig => (
  dispatch,
  { namespace: namespaceFromProps }
) => {
  const namespace =
    namespaceFromProps || namespaceFromConfig
  return {
    toggle: compose(
      dispatch,
      createToggle(namespace)
    ),
  }
}

export const withToggle = ({ namespace }) =>
  connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace)
  )

export const reducer = (
  state = {},
  { type, namespace }
) => {
  switch (type) {
    case TOGGLE:
      return {
        ...state,
        [namespace]: !state[namespace],
      }
    default:
      return state
  }
}
