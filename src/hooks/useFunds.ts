import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { fundsApi } from '../services/api'
import { useClient } from './useClient'
import { useAuth } from '../context/AuthContext'

export function useFunds() {
  const qc = useQueryClient()
  const { clientId } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { data: client, error: clientQueryError } = useClient()
  const { data: funds, isLoading, error: fundsQueryError } = useQuery({
    queryKey: ['funds', clientId],
    queryFn: () => fundsApi.list(clientId ?? undefined),
    enabled: !!clientId,
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['funds', clientId] })
    qc.invalidateQueries({ queryKey: ['client', clientId] })
  }

  const subscribe = useMutation({
    mutationFn: ({ id, clientId: cid }: { id: string; clientId: string }) => fundsApi.subscribe(id, cid),
    onSuccess: (_: unknown, vars: { id: string; clientId: string }) => {
      qc.setQueryData<unknown[] | undefined>(['funds', vars.clientId], (old: any) =>
        old?.map((f: any) => (f.id === vars.id ? { ...f, subscribed: true } : f)) ?? old,
      )
      qc.setQueryData<any>(['client', vars.clientId], (old: any) => {
        if (!old) return old
        const already = (old.activeFundIds ?? []).includes(vars.id)
        return {
          ...old,
          activeFundIds: already ? old.activeFundIds : [...(old.activeFundIds ?? []), vars.id],
          balance: typeof old.balance === 'number' ? old.balance - (funds?.find(f => f.id === vars.id)?.minAmount ?? 0) : old.balance,
        }
      })
      invalidate()
      setError(null)
      const fund = funds?.find(f => f.id === vars.id)
      setSuccessMsg(`Te suscribiste a ${fund?.name ?? 'el fondo'} exitosamente.`)
      setTimeout(() => setSuccessMsg(null), 4000)
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      setSuccessMsg(null)
      setError(e.response?.data?.message ?? 'Error al suscribirse')
    },
  })

  const cancel = useMutation({
    mutationFn: ({ id, clientId: cid }: { id: string; clientId: string }) => fundsApi.cancel(id, cid),
    onSuccess: (_: unknown, vars: { id: string; clientId: string }) => {
      qc.setQueryData<unknown[] | undefined>(['funds', vars.clientId], (old: any) =>
        old?.map((f: any) => (f.id === vars.id ? { ...f, subscribed: false } : f)) ?? old,
      )
      qc.setQueryData<any>(['client', vars.clientId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          activeFundIds: (old.activeFundIds ?? []).filter((fid: string) => fid !== vars.id),
          balance: typeof old.balance === 'number' ? old.balance + (funds?.find(f => f.id === vars.id)?.minAmount ?? 0) : old.balance,
        }
      })
      invalidate()
      setError(null)
      const fund = funds?.find(f => f.id === vars.id)
      setSuccessMsg(`Cancelaste la suscripción de ${fund?.name ?? 'el fondo'}.`)
      setTimeout(() => setSuccessMsg(null), 4000)
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      setSuccessMsg(null)
      setError(e.response?.data?.message ?? 'Error al cancelar')
    },
  })

  useEffect(() => {
    if ((clientQueryError as any)?.message) setError((clientQueryError as any).message)
    else if ((fundsQueryError as any)?.message) setError((fundsQueryError as any).message)
  }, [clientQueryError, fundsQueryError])

  return { funds, client, isLoading, error, successMsg, setError, setSuccessMsg, subscribe, cancel }
}
