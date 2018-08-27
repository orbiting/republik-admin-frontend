import React from 'react'
import {
  InlineSpinner,
  Label,
  Button,
} from '@project-r/styleguide'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { tableView as tableViewStyles } from '../styles'

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
      <div {...tableViewStyles.formSection}>
        <Label {...tableViewStyles.filterTitle}>
          Rematch Payments
        </Label>
        <div {...tableViewStyles.hBox}>
          <div {...tableViewStyles.cellTwo} />
          <div {...tableViewStyles.cell}>
            <Button
              disabled={loading}
              type="submit"
            >
              {(loading && (
                <InlineSpinner size="18px" />
              )) ||
                'Rematch'}
            </Button>
          </div>
        </div>
      </div>
    )}
  </Mutation>
)
