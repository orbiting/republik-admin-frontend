import React from 'react'
import {
  InlineSpinner,
  Button,
} from '@project-r/styleguide'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
// import { css } from 'glamor'

const REMATCH_PAYMENTS = gql`
  mutation rematchPayments {
    rematchPayments
  }
`

export default ({ refetchQueries }) => (
  <Mutation
    mutation={REMATCH_PAYMENTS}
    refetchQueries={refetchQueries}
  >
    {(rematch, { loading, data }) => (
      <Button disabled={loading} type="submit">
        {(loading && (
          <InlineSpinner size="18px" />
        )) ||
          'Rematch'}
      </Button>
    )}
  </Mutation>
)
