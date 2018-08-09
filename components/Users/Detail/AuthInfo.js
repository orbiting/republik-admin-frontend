import React from 'react'
import {
  Label,
  Interaction
} from '@project-r/styleguide'

const RolesForm = ({ user }) => {
  return (
    <div>
      <Interaction.H3>
        Login-Einstellungen
      </Interaction.H3>
      <p>
        <Label>Aktivierte Login-Methoden</Label>
        <br />
        {user.enabledFirstFactors
          .map(v =>
            v
              .split('_')
              .map(
                word =>
                  word.slice(0, 1).toUpperCase() +
                  word.slice(1).toLowerCase()
              )
              .join(' ')
          )
          .join('\n')}
      </p>
      <p>
        <Label>Bervorzugte Login-Methode</Label>
        <br />
        {(user.preferredFirstFactor &&
          user.preferredFirstFactor
            .split('_')
            .map(
              word =>
                word.slice(0, 1).toUpperCase() +
                word.slice(1).join(' ')
            )) ||
          '-'}
      </p>
    </div>
  )
}

export default RolesForm
