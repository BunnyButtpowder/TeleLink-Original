import React, { createContext, useContext, useState} from 'react'

const PermissionContext = createContext<any>(null)

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [permissions, setPermissions] = useState<number[]>([])

    return (
        <PermissionContext.Provider value={{ permissions, setPermissions }}>
            {children}
        </PermissionContext.Provider>
    )
}

export const usePermissions = () => useContext(PermissionContext)