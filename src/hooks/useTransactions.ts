import { useQuery } from '@tanstack/react-query'
import { transactionsApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export function useTransactions() {
  const { clientId } = useAuth()
  return useQuery({
    queryKey: ['transactions', clientId],
    queryFn: () => transactionsApi.list(clientId!),
    enabled: !!clientId,
  })
}
