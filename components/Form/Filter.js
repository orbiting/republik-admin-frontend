import { css } from 'glamor'

const styles = {
  header: css({
    position: 'relative',
    // display: 'flex',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
  }),
  toggleDisabledInput: css({
    position: 'absolute',
  }),
}

export default ({
  disabled,
  onChange,
  children,
}) => (
  <div {...styles.header}>
    <span {...styles.toggleDisabledInput}>
      <Checkbox
        checked={!disabled}
        onChange={(_, v) =>
          onChange && onChange(v)
        }
      />
    </span>
    {children}
  </div>
)
