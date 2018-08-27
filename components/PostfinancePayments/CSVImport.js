import React, { Component } from 'react'
import {
  colors,
  InlineSpinner,
  Interaction,
  Field,
  Button,
} from '@project-r/styleguide'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { css } from 'glamor'

import tableViewStyles from '../TableView/styles'

const styles = {
  label: css({
    lineHeight: '39px',
    display: 'block',
    borderBottom: `1px solid ${colors.disabled}`,
    minHeight: '39px',
  }),
  fileInput: css({
    width: 0,
    height: 0,
    opacity: 0,
    position: 'absolute',
  }),
  fileField: css({
    height: '64px',
  }),
}

const IMPORT_POSTFINANCE_CSV = gql`
  mutation importPostfinanceCSV($csv: String!) {
    importPostfinanceCSV(csv: $csv)
  }
`

export default class CSVImport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filename: null,
      csv: null,
      error: null,
    }

    this.handleFile = event => {
      const file = event.target.files[0]
      if (!file) {
        return
      }
      if (file.type.indexOf('csv') < 0) {
        this.setState({
          error: 'Not a valid CSV file',
        })
      } else {
        this.readFile(file)
          .then(({ content, filename }) => {
            this.setState({
              filename,
              csv: content,
            })
          })
          .catch(err => {
            this.setState({
              error: err,
            })
          })
      }
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.addEventListener(
        'load',
        event => {
          const url = event.target.result
          const content = url.replace(
            /^(.+,)/,
            ''
          )
          resolve({
            filename: file.name,
            content,
            url,
          })
        }
      )

      fileReader.addEventListener(
        'error',
        error => {
          reject(error)
        }
      )

      fileReader.readAsDataURL(file)
    })
  }

  render() {
    const { refetchQueries } = this.props
    const { csv, filename } = this.state
    return (
      <Mutation
        mutation={IMPORT_POSTFINANCE_CSV}
        refetchQueries={refetchQueries}
      >
        {(
          importPostfinanceCSV,
          { loading, data }
        ) => (
          <form
            {...tableViewStyles.container}
            onSubmit={e => {
              e.preventDefault()
              if (csv) {
                importPostfinanceCSV({
                  variables: csv,
                })
              }
            }}
          >
            <Interaction.P>
              Import Postfinance CSV
            </Interaction.P>
            <div {...tableViewStyles.hBox}>
              <div {...tableViewStyles.cellTwo}>
                <input
                  id="csv-input"
                  {...styles.fileInput}
                  type="file"
                  accept="application/csv"
                  name="csv"
                  onChange={e =>
                    this.handleFile(e)
                  }
                />
                <div {...styles.fileField}>
                  <Field
                    disabled={loading}
                    label={
                      <label htmlFor="csv-input">
                        Select CSV-File
                      </label>
                    }
                    value={filename}
                    renderInput={({
                      value,
                      props,
                    }) => (
                      <label
                        {...props}
                        {...styles.label}
                        htmlFor="csv-input"
                      >
                        {value}
                      </label>
                    )}
                  />
                </div>
              </div>
              <div {...tableViewStyles.cellOne}>
                <Button
                  disabled={loading}
                  type="submit"
                >
                  {(loading && (
                    <InlineSpinner size="18px" />
                  )) ||
                    'Upload'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Mutation>
    )
  }
}
