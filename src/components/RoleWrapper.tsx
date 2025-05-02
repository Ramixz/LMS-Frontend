import React from 'react'
import { useSelfRolesQuery } from '../services/roles.api'

function RoleWrapper({children, permissions} : {children: React.ReactNode, permissions: string[]}) {
    const { data } = useSelfRolesQuery()
    const allowed = data?.permission.some(p => permissions.includes(p))
    return (
    allowed? children : <></>
  )
}

export default RoleWrapper