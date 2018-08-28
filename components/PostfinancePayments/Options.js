import React, { Fragment } from 'react'
import {
  InlineSpinner,
  A,
  colors,
} from '@project-r/styleguide'
import { ErrorMessage } from '../ErrorMessage'
import { TableMessage } from '../TableView'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'

const styles = {
  option: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  }),
  button: css({
    cursor: 'pointer',
    '&[disabled]': {
      cursor: 'default',
      color: colors.disabled,
    },
  }),
  error: css({
    position: 'absolute',
    bottom: 0,
  }),
}

const HIDE_POSTFINANCE_PAYMENTS = gql`
  mutation hidePostfinancePayment($id: ID!) {
    hidePostfinancePayment(id: $id) {
      id
      hidden
    }
  }
`

const MANUALLY_MATCH_POSTFINANCE_PAYMENTS = gql`
  mutation manuallyMatchPostfinancePayment(
    $id: ID!
  ) {
    manuallyMatchPostfinancePayment(id: $id) {
      id
      hidden
    }
  }
`

export default ({
  postfinancePayment,
  refetchQueries,
}) =>
  !postfinancePayment.matched && (
    <Fragment>
      <Mutation
        mutation={HIDE_POSTFINANCE_PAYMENTS}
        refetchQueries={refetchQueries}
        variables={{ id: postfinancePayment.id }}
      >
        {(
          hidePostfinancePayment,
          { loading, error }
        ) => (
          <span {...styles.option}>
            <A
              {...styles.button}
              disabled={loading}
              onClick={() =>
                !loading &&
                hidePostfinancePayment()
              }
            >
              {'Hide'}
            </A>
            {loading && (
              <InlineSpinner size={'16px'} />
            )}
            {!loading &&
              error && (
                <Message>
                  {({ confirm }) => (
                    <ErrorMessage
                      error={error}
                      confirm={confirm}
                    />
                  )}
                </Message>
              )}
          </span>
        )}
      </Mutation>
      <Mutation
        mutation={
          MANUALLY_MATCH_POSTFINANCE_PAYMENTS
        }
        refetchQueries={refetchQueries}
        variables={{ id: postfinancePayment.id }}
      >
        {(
          manuallyMatchPostfinancePayment,
          { loading, error }
        ) => (
          <span {...styles.option}>
            <A
              {...styles.button}
              disabled={loading}
              onClick={() =>
                !loading &&
                manuallyMatchPostfinancePayment()
              }
            >
              {'Match'}
            </A>
            {loading && (
              <InlineSpinner size={'22px'} />
            )}
            {!loading &&
              error && (
                <TableMessage>
                  {({ confirm }) => (
                    <ErrorMessage
                      error={error}
                      confirm={confirm}
                    />
                  )}
                </TableMessage>
              )}
          </span>
        )}
      </Mutation>
    </Fragment>
  )
