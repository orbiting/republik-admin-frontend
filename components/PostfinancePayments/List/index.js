import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Spinner } from '@project-r/styleguide'
import ConnectedList from '../../ConnectedList'
import ErrorMessage from '../../ErrorMessage'

import TableForm from './TableForm'
import TableHead from './TableHead'
import TableBody from './TableBody'
import UploadForm from './UploadForm'

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

const IMPORT_POSTFINANCE_CSV = gql`
  mutation importPostfinanceCSV($csv: String!) {
    importPostfinanceCSV(csv: $csv)
  }
`

const REMATCH_PAYMENTS = gql`
  mutation rematchPayments {
    rematchPayments
  }
`

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

const GET_POSTFINANCE_PAYMENTS = gql`
  query postfinancePayments(
    $limit: Int!
    $offset: Int
    $orderBy: OrderBy
    $dateRange: DateRangeFilter
    $search: String
    $bool: BooleanFilter
  ) {
    postfinancePayments(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      dateRangeFilter: $dateRange
      search: $search
      booleanFilter: $bool
    ) {
      count
      items {
        id
        hidden
        buchungsdatum
        valuta
        avisierungstext
        gutschrift
        mitteilung
        matched
        createdAt
        updatedAt
      }
    }
  }
`

const POSTFINANCE_PAYMENTS_LIMIT = 200

export default class PostfinancePayments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      feedback: false,
    }

    this.handleError = error =>
      this.setState({
        error,
      })

    this.handleUploadResponse = ({ data }) =>
      this.setState({
        feedback: data.importPostfinanceCSV,
      })

    this.handleRematchResponse = ({ data }) =>
      this.setState({
        feedback: data.rematchPayments,
      })
  }

  renderErrors() {}

  render() {
    const messages = (
      <div>
        {this.renderErrors()}
        {this.state.feedback && (
          <div>{this.state.feedback}</div>
        )}
      </div>
    )
    return (
      <ConnectedList
        query={GET_POSTFINANCE_PAYMENTS}
        limit={POSTFINANCE_PAYMENTS_LIMIT}
        namespace={'postfinancePayments'}
      >
        {({
          formValue,
          // disabledFilters,
          loading,
          error,
          items,
          handleChange,
          // toggleField,
        }) => {
          const {
            search,
            dateRange,
            orderBy,
          } = formValue
          return (
            <div>
              <TableForm
                value={{ search, dateRange }}
                onChange={handleChange}
              />
              {items && (
                <TableHead
                  sort={orderBy}
                  onSort={v =>
                    handleChange({ orderBy: v })
                  }
                />
              )}
              {error ? (
                <ErrorMessage error={error} />
              ) : loading ? (
                <div style={{ height: 100 }}>
                  <Spinner />
                </div>
              ) : items ? (
                <TableBody items={items} />
              ) : null}
            </div>
          )
        }}
      </ConnectedList>
    )
  }
}

/*
class PostfinancePayments extends Component {


    const {
      data: { postfinancePayments },
      params,
      loadMorePayments,
      updatePostfinancePayment,
      hidePostfinancePayment,
      manuallyMatchPostfinancePayment,
      onChange,
    } = props


        <div>
          {renderErrors()}
          {this.state.feedback && (
            <div>{this.state.feedback}</div>
          )}
          <TableForm
            search={params.search}
            onSearch={changeHandler('search')}
            dateRange={DateRange.parse(
              params.dateRange
            )}
            onDateRange={changeHandler(
              'dateRange',
              DateRange.serialize
            )}
            bool={Bool.parse(params.bool)}
            onBool={changeHandler(Bool.serialize)}
            onUpload={this.uploadHandler}
            onRematch={this.rematchHandler}
          />
          <TableHead
            sort={deserializeOrderBy(
              params.orderBy
            )}
            onSort={changeHandler(
              'orderBy',
              serializeOrderBy
            )}
          />
          <TableBody
            items={
              props.data.postfinancePayments.items
            }
            onMessage={updatePostfinancePayment}
            onHide={hidePostfinancePayment}
            onMatch={
              manuallyMatchPostfinancePayment
            }
          />
        </div>
      </InfiniteScroller>
    )
  }
}
*/
