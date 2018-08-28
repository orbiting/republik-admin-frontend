import React from 'react'
import {
  InlineSpinner,
  Label,
  Button,
} from '@project-r/styleguide'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import {
  ErrorMessage,
  SuccessMessage,
} from '../ErrorMessage'

import { tableView as tableViewStyles } from '../styles'

const REMATCH_PAYMENTS = gql`
  mutation rematchPayments {
    rematchPayments
  }
`

const reportLabels = [
  'Matched payments',
  'Updated pledges',
  'Payments successfull',
]

export default ({ refetchQueries }) => (
  <Mutation
    mutation={REMATCH_PAYMENTS}
    refetchQueries={refetchQueries}
  >
    {(rematch, { loading, data, error }) => (
      <div {...tableViewStyles.formSection}>
        <Label {...tableViewStyles.filterTitle}>
          Rematch Payments
        </Label>
        <div {...tableViewStyles.hBox}>
          <div {...tableViewStyles.cellTwo} />
        </div>
        <div {...tableViewStyles.formActions}>
          <Button
            disabled={loading}
            onClick={rematch}
          >
            {(loading && (
              <InlineSpinner size="38px" />
            )) ||
              'Rematch'}
          </Button>
          {!loading &&
            !error &&
            data &&
            data.rematchPayments && (
              <SuccessMessage
                success={data.rematchPayments
                  .match(/[0-9]+/gm)
                  .map((v, i) => (
                    <Label key={i}>
                      {reportLabels[i]}
                      {': '}
                      {v}
                      {'. '}
                    </Label>
                  ))}
              />
            )}
          {error && (
            <ErrorMessage error={error} />
          )}
        </div>
      </div>
    )}
  </Mutation>
)
