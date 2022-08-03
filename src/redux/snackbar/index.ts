import { AlertColor } from '@mui/material'
import { createModel } from '@rematch/core'
import { RootModel } from '..'

interface Snackbar {
  message: string
  type?: AlertColor
}

export const snackbar = createModel<RootModel>()({
  state: {
    message: ''
  } as Snackbar,
  reducers: {
    openSnackbar(state, payload) {
      state.message = payload
      state.type = payload
    },
    closeSnackbar(state) {
      state.message = ''
      state.type = undefined
    }
  }
})
