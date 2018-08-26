import App, { Container } from 'next/app'
import { withRouter } from 'next/router'
import React from 'react'
import { compose } from 'react-apollo'

import { ApolloProvider } from 'react-apollo'
import { Provider as ReduxProvider } from 'react-redux'
import withApolloClient from '../lib/withApolloClient'
import withReduxStore from '../lib/withReduxStore'
import { enforceAuthorization } from '../components/Auth/withAuthorization'
const withAdminUser = enforceAuthorization([
  'supporter',
  'admin',
  'accountant',
])

class MyApp extends App {
  render() {
    const {
      Component,
      pageProps,
      router,
      apolloClient,
      reduxStore,
    } = this.props
    const DecoratedComp = withAdminUser(Component)
    return (
      <Container>
        <ReduxProvider store={reduxStore}>
          <ApolloProvider client={apolloClient}>
            <DecoratedComp
              {...pageProps}
              url={router}
            />
          </ApolloProvider>
        </ReduxProvider>
      </Container>
    )
  }
}

export default compose(
  withApolloClient,
  withReduxStore,
  withRouter
)(MyApp)
