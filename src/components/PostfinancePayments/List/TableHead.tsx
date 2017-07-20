import * as React from 'react'
import { Table, Row, Cell } from '../../Layout/Table'
import * as Sticky from 'react-sticky-el'
import { Label, colors } from '@project-r/styleguide'
import SortIndicator from '../../SortIndicator'

export type SortDirection = 'asc' | 'desc'

export interface SortOptions {
  sortBy?: string
  sortDirection?: SortDirection
}

export interface HeadProps {
  [key: string]: any
  onSort: (value: string) => void
  sort?: string
}

const rowStyles = {
  maxHeight: '40px',
  backgroundColor: '#fff',
  borderBottom: `1px solid ${colors.divider}`
}

const interactiveStyles = {
  cursor: 'pointer'
}

const deserializeParams = (str?: string): SortOptions => {
  if (!str) {
    return {}
  }
  const [field, direction] = str.split(':')
  return {
    sortBy: field.toString(),
    sortDirection: direction as SortDirection
  }
}

const serializeParams = ({
  sortBy,
  sortDirection
}: SortOptions): string => `${sortBy}:${sortDirection}`

const createSortHandler = (
  sort: SortOptions,
  handler: (value: string) => void
) => (fieldName: string) => () => {
  if (sort.sortBy !== fieldName) {
    return handler(
      serializeParams({
        sortBy: fieldName,
        sortDirection: 'asc'
      })
    )
  } else {
    return handler(
      serializeParams({
        sortBy: sort.sortBy,
        sortDirection:
          sort.sortDirection === 'asc' ? 'desc' : 'asc'
      })
    )
  }
}

const createIndicator = (sort: SortOptions) => (
  fieldName: string
) => {
  if (sort.sortBy === fieldName) {
    return (
      <SortIndicator sortDirection={sort.sortDirection} />
    )
  } else {
    return null
  }
}

export default ({ sort, onSort, ...props }: HeadProps) => {
  const sortOpts = deserializeParams(sort) || {}
  const sortHandler = createSortHandler(sortOpts, onSort)
  const indicator = createIndicator(sortOpts)

  return (
    <Sticky scrollElement="#content" {...props}>
      <Table>
        <Row style={rowStyles}>
          <Cell
            flex="0 0 10%"
            style={interactiveStyles}
            onClick={sortHandler('buchungsdatum')}
          >
            <Label>
              Buchungsdatum{indicator('buchungsdatum')}
            </Label>
          </Cell>

          <Cell
            flex="0 0 10%"
            style={interactiveStyles}
            onClick={sortHandler('valuta')}
          >
            <Label>
              Valuta{indicator('valuta')}
            </Label>
          </Cell>

          <Cell
            flex="0 0 30%"
            style={{ paddingRight: '10px' }}
          >
            <Label>Avisierungstext</Label>
          </Cell>

          <Cell
            flex="0 0 10%"
            style={interactiveStyles}
            onClick={sortHandler('gutschrift')}
          >
            <Label>
              Gutschrift{indicator('gutschrift')}
            </Label>
          </Cell>

          <Cell flex="0 0 10%">
            <Label>Mitteilung</Label>
          </Cell>

          <Cell
            flex="0 0 10%"
            style={interactiveStyles}
            onClick={sortHandler('matched')}
          >
            <Label>
              Matched{indicator('matched')}
            </Label>
          </Cell>

          <Cell
            flex="0 0 10%"
            style={interactiveStyles}
            onClick={sortHandler('createdAt')}
          >
            <Label>
              Created{indicator('createdAt')}
            </Label>
          </Cell>
        </Row>
      </Table>
    </Sticky>
  )
}