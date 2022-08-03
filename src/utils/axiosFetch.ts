import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { apiErrorHandler } from '@utils/apiErrorHandler'
import { ScalableEntity } from '@entity/Base'
import { AUTH_KEY } from '@enums/AppConst'

export type AxiosPayload = {
  instance: AxiosInstance
  request: AxiosRequestConfig
}

export type ResponseError = {
  form?: Map<string, string>
  reason?: string
  id: string
}

export type AxiosError = {
  data: ResponseError
  status: number
}

const instance = axios.create({
  baseURL: 'http://api.github.com/',
  timeout: 100000,
  withCredentials: false,
  headers: {
    Accept: 'application/vnd.github+json'
  }
})

export const axiosErrorHandler = (payload: ScalableEntity) => {
  const { form, reason, status } = apiErrorHandler(payload)
  return {
    data: {
      id: payload.id,
      form,
      reason
    },
    status
  }
}

export const fetch = (request: AxiosRequestConfig) => {
  const token = localStorage.getItem(AUTH_KEY)
  if (!token) {
    return instance(request)
  }
  const authRequest = {
    ...request,
    headers: {
      ...request.headers,

      Authorization: `Bearer ${token}`
    }
  }

  return instance(authRequest)
}

export const fetchExternal = (request: AxiosRequestConfig) => instance(request)
