import React from 'react'
import { errorToString } from '../lib/utils/errors'

import {
  Interaction,
  colors,
  Label,
} from '@project-r/styleguide'

export const ErrorMessage = ({
  label = 'Error',
  error,
}) => (
  <Interaction.P>
    <span
      style={{
        color: colors.error,
        display: 'block',
      }}
    >
      {label}
    </span>
    <Label>{errorToString(error)}</Label>
  </Interaction.P>
)

export const SuccessMessage = ({
  label = 'Success',
  success,
}) => (
  <Interaction.P>
    <span
      style={{
        color: colors.primary,
        display: 'block',
      }}
    >
      {label}
    </span>
    <Label>{success}</Label>
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
