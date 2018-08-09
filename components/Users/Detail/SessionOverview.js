import React, { Component } from 'react'
import { css } from 'glamor'
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Label,
  Button,
  Interaction,
  colors
} from '@project-r/styleguide'
import List, { Item } from '../../List'

import { swissTime } from '../../../lib/utils/formats'

const dateTimeFormat = swissTime.format(
  '%e. %B %Y %H.%M Uhr'
)

const sessionQuery = gql`
  query user($id: String) {
    user(slug: $id) {
      id
      sessions {
        id
        expiresAt
        city
        country
        countryFlag
        ipAddress
        userAgent
        device {
          id
          lastSeen
          information {
            os
            model
            osVersion
            appVersion
          }
        }
      }
    }
  }
`

const clearSessionMutation = gql`
  mutation clearSession(
    $sessionId: ID!
    $userId: ID!
  ) {
    clearSession(
      sessionId: $sessionId
      userId: $userId
    )
  }
`

const clearSessionsMutation = gql`
  mutation clearSessions($userId: ID!) {
    clearSessions(userId: $userId)
  }
`

const styles = {
  session: css({
    padding: 10,
    backgroundColor: colors.secondaryBg
  }),
  section: css({ margin: '0 0 10px 0' }),
  blockLabel: css({
    display: 'block'
  })
}

class SessionOverview extends Component {
  render() {
    const sessions =
      (this.props.data &&
        this.props.data.user &&
        this.props.data.user.sessions) ||
      []
    return (
      <List>
        {sessions.map((session, index) => {
          const { device } = session
          const { information } = device || {}
          return (
            <Item key={`session-${index}`}>
              <div {...styles.session}>
                <Interaction.P
                  {...styles.section}
                >
                  <Label {...styles.blockLabel}>
                    Session
                  </Label>
                  {session.userAgent}
                  <Label {...styles.blockLabel}>
                    Ablaufdatum:{' '}
                    {dateTimeFormat(
                      new Date(session.expiresAt)
                    )}
                  </Label>

                  {session.city &&
                    session.country && (
                      <Label
                        {...styles.blockLabel}
                      >
                        Ort: {session.city}{' '}
                        {session.country}
                      </Label>
                    )}
                </Interaction.P>

                {device && (
                  <Interaction.P
                    {...styles.section}
                  >
                    <Label {...styles.blockLabel}>
                      Gerät
                    </Label>
                    {information.model}{' '}
                    {information.os}
                    <Label {...styles.blockLabel}>
                      App-Version:{' '}
                      {information.appVersion}
                    </Label>
                    <Label {...styles.blockLabel}>
                      OS-Version:{' '}
                      {information.osVersion}
                    </Label>
                    <Label {...styles.blockLabel}>
                      Zuletzt atktiv:{' '}
                      {dateTimeFormat(
                        new Date(device.lastSeen)
                      )}
                    </Label>
                  </Interaction.P>
                )}

                <Button
                  onClick={() => {
                    this.props.clearSession({
                      userId: this.props.user.id,
                      sessionId: session.id
                    })
                  }}
                >
                  Clear Session
                </Button>
              </div>
            </Item>
          )
        })}
        <Button
          disabled={sessions.length === 0}
          onClick={() => {
            this.props.clearSessions({
              userId: this.props.user.id
            })
          }}
        >
          Clear all Sessions
        </Button>
      </List>
    )
  }
}

const WrappedSessionOverview = compose(
  graphql(clearSessionMutation, {
    props: ({ mutate, ownProps: { user } }) => ({
      clearSession: variables => {
        if (mutate) {
          return mutate({
            variables,
            refetchQueries: [
              {
                query: sessionQuery,
                variables: {
                  id: user.id
                }
              }
            ]
          })
        }
      }
    })
  }),
  graphql(clearSessionsMutation, {
    props: ({ mutate, ownProps: { user } }) => ({
      clearSessions: variables => {
        if (mutate) {
          return mutate({
            variables,
            refetchQueries: [
              {
                query: sessionQuery,
                variables: {
                  id: user.id
                }
              }
            ]
          })
        }
      }
    })
  }),
  graphql(sessionQuery, {
    options: ({ user }) => {
      return {
        variables: {
          id: user.id
        }
      }
    }
  })
)(SessionOverview)

export default WrappedSessionOverview
