import App, { Container } from 'next/app'
import { withRouter } from 'next/router'
import React from 'react'
import { compose } from 'react-apollo'

import { ApolloProvider } from 'react-apollo'
import withData from '../lib/withData'
import { enforceAuthorization } from '../components/Auth/withAuthorization'
const withAdminUser = enforceAuthorization(['supporter', 'admin', 'accountant'])

class MyApp extends App {
  render () {
    const {
      Component,
      pageProps,
      router,
      apolloClient
    } = this.props
    const DecoratedComp = withAdminUser(Component)
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <DecoratedComp
            {...pageProps}
            url={router}
          />
        </ApolloProvider>
      </Container>
    )
  }
}

export default compose(withData, withRouter)(
  MyApp
)
