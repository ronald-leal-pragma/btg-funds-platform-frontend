import axios from 'axios'
import type { Client, Fund, Transaction } from '../types'

const BASE = (import.meta.env.VITE_API_BASE as string) ?? '/api/v1'

const http = axios.create({ baseURL: BASE, timeout: 10000 })

const handle = <T>(p: Promise<{ data: T }>) => p.then(r => r.data)

export const fundsApi = {
  list: async () => {
    const data = await http.get('/funds').then(r => r.data)
    // Backend returns objects like { fund: {...}, subscribed: boolean }
    return data.map((item: any) => ({ ...(item.fund ?? item), subscribed: item.subscribed ?? false })) as Fund[]
  },
  subscribe: (id: string) => handle<Transaction>(http.post(`/funds/${id}/subscribe`)),
  cancel: (id: string) => handle<Transaction>(http.delete(`/funds/${id}/cancel`)),
}

export const transactionsApi = {
  list: () => handle<Transaction[]>(http.get('/transactions')),
}

export const clientApi = {
  get: () => handle<Client>(http.get('/client')),
}
