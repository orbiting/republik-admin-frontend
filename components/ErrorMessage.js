import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import { css } from 'glamor'
import { errorToString } from '../lib/utils/errors'

import {
  Interaction,
  colors,
  Label,
} from '@project-r/styleguide'

const styles = {
  message: css({
    width: 'auto',
    margin: '0 -20px',
    padding: '3px 20px',
  }),
  header: css({
    display: 'block',
  }),
  body: css({
    display: 'block',
  }),
  confirm: css({
    marginTop: '17px',
    display: 'block',
    cursor: 'pointer',
  }),
  error: css({
    color: colors.error,
  }),
  errorBg: css({
    backgroundColor: '#FFF6F3',
  }),
  success: css({
    color: colors.primary,
  }),
  successBg: css({
    backgroundColor: colors.primaryBg,
  }),
}

export const ErrorMessage = ({
  label = 'Error',
  error,
  confirm,
}) => (
  <Interaction.P
    {...styles.message}
    {...styles.errorBg}
  >
    <span {...styles.header} {...styles.error}>
      {label}
    </span>
    <Label {...styles.body}>
      {errorToString(error)}
    </Label>
    {confirm && (
      <Label
        {...styles.confirm}
        onClick={confirm}
      >
        <span {...styles.error}>OK</span>
      </Label>
    )}
  </Interaction.P>
)

export const SuccessMessage = ({
  label = 'Success',
  success,
  confirm,
}) => (
  <Interaction.P
    {...styles.message}
    {...styles.successBg}
  >
    <span {...styles.header} {...styles.success}>
      {label}
    </span>
    <Label {...styles.body}>{success}</Label>
    {confirm && (
      <Label
        {...styles.confirm}
        onClick={confirm}
      >
        <span {...styles.success}>OK</span>
      </Label>
    )}
  </Interaction.P>
)

export default ({ error }) => (
  <Interaction.P
    style={{
      color: colors.error,
      margin: '20px 0',
    }}
  >
    {errorToString(error)}
  </Interaction.P>
)

export const MessagesContainer = props => (
  <div {...props} id="messages" />
)

export class Message extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: true,
    }
    this.el = document.createElement('div')
    this.root = document.getElementById(
      'messages'
    )
  }

  componentDidMount() {
    this.root.appendChild(this.el)
  }

  componentWillUnmount() {
    this.root.removeChild(this.el)
  }

  render() {
    return (
      this.state.isVisible &&
      createPortal(
        this.props.children({
          confirm: () =>
            this.setState({ isVisible: false }),
        }),
        this.root
      )
    )
  }
}
