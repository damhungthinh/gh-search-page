import { ScalableEntity } from '@entity/Base'
import { get } from 'lodash'

export type CustomError = {
  status: number
  code?: number
  reason?: string
  form?: Map<string, string>
}

const ERROR = {
  504: 'Services are under mantaince. Please try again later!',
  401: 'Your session expired, please login again!'
}

export const apiErrorHandler = (_error: ScalableEntity, _messages?: ScalableEntity | string) => {
  const error: CustomError = {
    status: 500
  }
  if (!_error || !get(_error, 'status') || !get(_error, 'id')) {
    error.reason = "Can't connect to server. Please check your connection or try again later!"
    return error
  }

  error.status = get(_error, 'status', 500)
  if (get(_error, 'status', 0) < 500) {
    const reason = get(_error, 'reason', '')
    const form = get(_error, 'form', {})

    if (reason) {
      error.reason = reason
    }
    if (Object.keys(form).length) {
      error.form = form
    }
  }
  if (!error.reason && !error.form) {
    error.reason = get(ERROR, error.status, 'Something bad happened, please try again later')
  }
  return error
}
