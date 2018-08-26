import {
  createStore,
  combineReducers,
} from 'redux'

import { reducer as tableControl } from '../components/Form'

const reducer = combineReducers({
  tableControl,
})

export default initialState => {
  return createStore(reducer, initialState)
}
