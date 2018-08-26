import {
  createStore,
  combineReducers,
} from 'redux'

import { reducer as tableControl } from '../components/TableView/tableControl'
import { reducer as toggle } from '../components/Form/toggle'

const reducer = combineReducers({
  tableControl,
  toggle,
})

export default initialState => {
  return createStore(reducer, initialState)
}
