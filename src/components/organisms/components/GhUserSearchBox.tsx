import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { TextField } from '@mui/material'

type GhUserSearchBoxProps = {
  loading: boolean
  keyword?: string
  onSearch: (keyword: string) => void
}

const GhUserSearchBox = (props: GhUserSearchBoxProps) => {
  const { loading, keyword = '', onSearch } = props
  const [value, setValue] = useState<string>(keyword)
  const [waitEvent, setWaitEvent] = useState<ChangeEvent<HTMLInputElement>>()

  const handleValueChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    setWaitEvent(event)
  }, [])

  useEffect(() => {
    let timer: any
    // Set delay for submit value when typing
    if (waitEvent) {
      timer = setTimeout(() => {
        const {
          target: { value }
        } = waitEvent
        onSearch(value)
      }, 500)
    }
    return () => clearTimeout(timer as NodeJS.Timeout)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitEvent])

  return (
    <TextField
      fullWidth
      autoFocus
      variant="outlined"
      placeholder="Enter GitHub username, i.e. gaearon"
      value={value}
      disabled={loading}
      onChange={handleValueChanged}
    />
  )
}

export default GhUserSearchBox
