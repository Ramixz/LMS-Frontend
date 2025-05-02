import React from 'react'
import { useSelfRolesQuery } from '../services/roles.api'

export default function useHasPermission(permissions: string[]) {
    const { data } = useSelfRolesQuery()
    const allowed = data?.permission.some(p => permissions.includes(p))
    return allowed ?? false

}
