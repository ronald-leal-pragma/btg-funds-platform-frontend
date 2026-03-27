import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { fundsApi } from '../services/api'
import { useClient } from './useClient'

export function useFunds() {
  const qc = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { data: client } = useClient()
  const { data: funds, isLoading } = useQuery({ queryKey: ['funds'], queryFn: fundsApi.list })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['funds'] })
    qc.invalidateQueries({ queryKey: ['client'] })
  }

  const subscribe = useMutation({
    mutationFn: fundsApi.subscribe,
    onSuccess: (_: unknown, id: string) => {
      invalidate()
      setError(null)
      const fund = funds?.find(f => f.id === id)
      setSuccessMsg(`Te suscribiste a ${fund?.name ?? 'el fondo'} exitosamente.`)
      setTimeout(() => setSuccessMsg(null), 4000)
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      setSuccessMsg(null)
      setError(e.response?.data?.message ?? 'Error al suscribirse')
    },
  })

  const cancel = useMutation({
    mutationFn: fundsApi.cancel,
    onSuccess: (_: unknown, id: string) => {
      invalidate()
      setError(null)
      const fund = funds?.find(f => f.id === id)
      setSuccessMsg(`Cancelaste la suscripción de ${fund?.name ?? 'el fondo'}.`)
      setTimeout(() => setSuccessMsg(null), 4000)
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      setSuccessMsg(null)
      setError(e.response?.data?.message ?? 'Error al cancelar')
    },
  })

  return { funds, client, isLoading, error, successMsg, setError, setSuccessMsg, subscribe, cancel }
}
