import App, { Container } from 'next/app'
import { withRouter } from 'next/router'
import React from 'react'
import { compose } from 'react-apollo'

import { ApolloProvider } from 'react-apollo'
import withData from '../lib/withData'

class MyApp extends App {
  render() {
    const {
      Component,
      pageProps,
      router,
      apolloClient
    } = this.props
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component
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
