import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import ErrorMessage from '../ErrorMessage'
import {
  colors,
  InlineSpinner,
  Interaction,
  Dropdown,
  Button,
} from '@project-r/styleguide'

import styles from '../TableView/styles'

const companies = [
  { text: 'Republik AG', value: 'REPUBLIK' },
  { text: 'Project R', value: 'PROJECT_R' },
]

const link = css({
  textDecoration: 'none',
  color: colors.primary,
  ':visited': {
    color: colors.primary,
  },
  ':hover': {
    color: colors.secondary,
  },
})

const GET_PAYMENTS_CSV = gql`
  query paymentsCSV($companyName: String!) {
    paymentsCSV(companyName: $companyName)
  }
`

export default class CSVDownloader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      csvRequested: false,
      selectedCompany: companies[0],
    }

    this.handleCompany = v =>
      this.setState({
        csvRequested: false,
        selectedCompany: v,
      })

    this.handleCsvRequest = () =>
      this.setState({
        csvRequested: true,
      })
  }

  renderDownloadLink(paymentsCSV) {
    const blob = new Blob([paymentsCSV], {
      type: 'text/csv',
    })
    const url = URL.createObjectURL(blob)

    return (
      <a
        className={`${link}`}
        download="export.csv"
        href={url}
      >
        Download CSV
      </a>
    )
  }

  render() {
    const {
      selectedCompany,
      csvRequested,
    } = this.state
    return (
      <Query
        query={GET_PAYMENTS_CSV}
        skip={!csvRequested}
        variables={{
          companyName: selectedCompany.value,
        }}
      >
        {({ data, loading, error }) => {
          const { paymentsCSV } = data || {}

          return (
            <div {...styles.container}>
              <Interaction.P>
                Export CSV
              </Interaction.P>
              {error && (
                <ErrorMessage error={error} />
              )}
              <div {...styles.hBox}>
                <div {...styles.cellTwo}>
                  <Dropdown.Native
                    label={'Company'}
                    value={selectedCompany.value}
                    items={companies}
                    onChange={this.handleCompany}
                  />
                </div>
                <div {...styles.cellOne}>
                  {csvRequested &&
                    paymentsCSV &&
                    !loading &&
                    this.renderDownloadLink(
                      paymentsCSV
                    )}
                  {!paymentsCSV && (
                    <Button
                      onClick={
                        this.handleCsvRequest
                      }
                    >
                      {(!csvRequested &&
                        'Get CSV Export') ||
                        (loading && (
                          <InlineSpinner />
                        ))}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}
