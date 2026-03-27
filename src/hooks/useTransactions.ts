import { useQuery } from '@tanstack/react-query'
import { transactionsApi } from '../services/api'

export function useTransactions() {
  return useQuery({ queryKey: ['transactions'], queryFn: transactionsApi.list })
}
