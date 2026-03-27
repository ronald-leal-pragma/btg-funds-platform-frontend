export interface Fund {
  id: string
  name: string
  minAmount: number
  category: string
  subscribed: boolean
}

export interface Transaction {
  id: string
  type: 'APERTURA' | 'CANCELACION'
  fundId: string
  fundName: string
  amount: number
  timestamp: string
}

export interface Client {
  id: string
  balance: number
  notificationPreference: 'email' | 'sms'
  contactInfo: string
  activeFundIds: string[]
  email: string
}

export interface CreateClientRequest {
  email: string
  password: string
  notificationPreference: 'email' | 'sms'
  contactInfo: string
}

export interface LoginRequest {
  email: string
  password: string
}
