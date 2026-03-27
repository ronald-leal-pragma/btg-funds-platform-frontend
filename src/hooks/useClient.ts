import { useQuery, useQueryClient } from '@tanstack/react-query'
import { clientApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export function useClient() {
  const { clientId } = useAuth()
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientApi.get(clientId!),
    enabled: !!clientId,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status
      if (status === 404 || status === 400) return false
      return failureCount < 3
    },
  })
}

export function useInvalidateClient() {
  const { clientId } = useAuth()
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['client', clientId] })
}
