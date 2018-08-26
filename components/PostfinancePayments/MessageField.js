import React from 'react'
import {
  InlineSpinner,
  colors,
} from '@project-r/styleguide'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'

const styles = {
  field: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }),
  input: css({
    width: '70%',
    outline: 'none',
    fontSize: 'inherit',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid',
    borderBottomColor: colors.disabled,
    '&:focus': {
      borderBottomColor: colors.primary,
    },
  }),
}

const UPDATE_POSTFINANCE_PAYMENT = gql`
  mutation updatePostfinancePayment(
    $id: ID!
    $message: String!
  ) {
    updatePostfinancePayment(
      pfpId: $id
      mitteilung: $message
    ) {
      id
      hidden
    }
  }
`

export default ({
  postfinancePayment,
  refetchQueries,
}) =>
  !postfinancePayment.matched ? (
    <Mutation
      mutation={UPDATE_POSTFINANCE_PAYMENT}
      refetchQueries={refetchQueries}
    >
      {(
        updatePostfinancePayment,
        { loading }
      ) => (
        <form
          {...styles.field}
          onSubmit={e => {
            e.preventDefault()
            updatePostfinancePayment({
              variables: {
                id: postfinancePayment.id,
                message:
                  e.target.elements[0].value,
              },
            })
          }}
        >
          <input
            {...styles.input}
            type="text"
            name="mitteilung"
            autoComplete="off"
            defaultValue={
              postfinancePayment.mitteilung || ''
            }
          />
          {loading && (
            <InlineSpinner size={'22px'} />
          )}
        </form>
      )}
    </Mutation>
  ) : (
    postfinancePayment.mitteilung
  )
