import { useQuery } from '@tanstack/react-query'
import { clientApi } from '../services/api'

export function useClient() {
  return useQuery({ queryKey: ['client'], queryFn: clientApi.get })
}
