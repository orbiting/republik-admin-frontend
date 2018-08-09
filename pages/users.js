import React from 'react'
import App from '../components/App'
import {
  Body,
  Content,
  Header
} from '../components/Layout'
import Users from '../components/Users/List'
import { Router } from '../server/routes'

const changeHandler = params => {
  Router.pushRoute('users', params)
}

export default props => {
  return (
    <App>
      <Body>
        <Header />
        <Content id="content">
          <Users
            params={props.url.query}
            onChange={changeHandler}
          />
        </Content>
      </Body>
    </App>
  )
}
