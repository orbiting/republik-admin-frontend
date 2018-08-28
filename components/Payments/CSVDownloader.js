import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'
import ErrorMessage from '../ErrorMessage'
import {
  colors,
  InlineSpinner,
  Label,
  Dropdown,
  Button,
} from '@project-r/styleguide'

import { tableView as tableViewStyles } from '../styles'

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

    this.handleCompany = event =>
      this.setState({
        csvRequested: false,
        selectedCompany: companies.find(
          ({ value }) =>
            value === event.target.value
        ),
      })

    this.handleCsvRequest = () =>
      this.setState({
        csvRequested: true,
      })
    this.resetCsvRequest = () =>
      this.setState({
        csvRequested: false,
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
        onClick={this.resetCsvRequest}
        href={url}
      >
        <Button>Download CSV</Button>
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
            <Fragment>
              <div
                {...tableViewStyles.formSection}
              >
                <Label
                  {...tableViewStyles.filterTitle}
                >
                  Export CSV
                </Label>
                <div {...tableViewStyles.hBox}>
                  <div
                    {...tableViewStyles.cellTwo}
                  >
                    <Dropdown.Native
                      label={'Company'}
                      value={
                        selectedCompany.value
                      }
                      items={companies}
                      onChange={
                        this.handleCompany
                      }
                    />
                  </div>
                </div>
              </div>
              <div
                {...tableViewStyles.formActions}
              >
                {csvRequested &&
                paymentsCSV &&
                !loading ? (
                  this.renderDownloadLink(
                    paymentsCSV
                  )
                ) : (
                  <Button
                    disabled={
                      loading && csvRequested
                    }
                    onClick={
                      this.handleCsvRequest
                    }
                  >
                    {(loading &&
                      csvRequested && (
                        <InlineSpinner size="38px" />
                      )) ||
                      'Get CSV Export'}
                  </Button>
                )}

                {error && (
                  <ErrorMessage error={error} />
                )}
              </div>
            </Fragment>
          )
        }}
      </Query>
    )
  }
}
