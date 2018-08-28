import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import Sticky from 'react-sticky-el'

export const Container = props => (
  <Sticky scrollElement="#content">
    <div {...props} id="messages" />
  </Sticky>
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
