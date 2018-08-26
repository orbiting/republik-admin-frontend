import { compose } from 'redux'
import { connect } from 'react-redux'

export const TOGGLE = 'TOGGLE'

const capitalize = ([s, ...tring]) =>
  [s.toUpperCase(), ...tring].join('')

export const createToggle = namespace => () => ({
  type: TOGGLE,
  namespace,
})

const mapStateToProps = namespace => ({
  toggle: state,
}) => ({
  [`is${capitalize(namespace)}Toggled`]: state[
    namespace
  ],
})

const mapDispatchToProps = namespace => dispatch => ({
  [`toggle${capitalize(namespace)}`]: compose(
    dispatch,
    createToggle(namespace)
  ),
})

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
