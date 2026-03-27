import axios from 'axios'
import type { Client, CreateClientRequest, Fund, LoginRequest, Transaction } from '../types'

const BASE = (import.meta.env.VITE_API_BASE as string) ?? '/api/v1'

const http = axios.create({ baseURL: BASE, timeout: 10000 })

async function request<T>(p: Promise<import('axios').AxiosResponse<T>>): Promise<T> {
  try {
    const res = await p
    return res.data
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? err?.message ?? 'Error desconocido'
    const e = new Error(msg) as any
    if (err?.response) e.response = err.response
    throw e
  }
}

export const fundsApi = {
  list: async (clientId?: string) => {
    const data = await request<any[]>(http.get('/funds', { params: { clientId } }))
    return data.map((item: any) => {
      const fundObj = item.fund ?? item
      const subscribed = item.subscribed ?? fundObj.subscribed ?? false
      return { ...fundObj, subscribed } as Fund
    })
  },
  subscribe: (id: string, clientId: string) =>
    request<Transaction>(http.post(`/funds/${id}/subscribe`, null, { params: { clientId } })),
  cancel: (id: string, clientId: string) =>
    request<Transaction>(http.delete(`/funds/${id}/cancel`, { params: { clientId } })),
}

export const transactionsApi = {
  list: (clientId: string) =>
    request<Transaction[]>(http.get('/transactions', { params: { clientId } })),
}

export const clientApi = {
  get: (clientId: string) => request<Client>(http.get(`/client/${clientId}`)),
  create: (data: CreateClientRequest) => request<Client>(http.post('/client', data)),
  login: (data: LoginRequest) => request<Client>(http.post('/client/login', data)),
}
