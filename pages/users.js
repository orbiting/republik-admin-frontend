import React from 'react'
import App from '../components/App'
import {
  Body,
  Content,
  Header,
} from '../components/Layout'
import Users from '../components/Users/List'

export default () => {
  return (
    <App>
      <Body>
        <Header />
        <Content id="content">
          <Users />
        </Content>
      </Body>
    </App>
  )
}
