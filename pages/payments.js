import React from 'react'
import App from '../components/App'
import {
  Body,
  Content,
  Header
} from '../components/Layout'
import Payments from '../components/Payments/List'
import { Router } from '../server/routes'

const changeHandler = params => {
  Router.pushRoute('payments', params)
}

export default props => {
  return (
    <App>
      <Body>
        <Header />
        <Content id="content">
          <Payments
            params={props.url.query}
            onChange={changeHandler}
          />
        </Content>
      </Body>
    </App>
  )
}
