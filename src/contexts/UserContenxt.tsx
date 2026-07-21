
"use client"
import { UserData } from '@/models/Auth.model'
import { CompanyInfo } from '@/models/Companyinfo.model'
import { getItem, setItem } from '@/utils/services/local-storage.service'
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

export const COMPANY_INFO_STORAGE_KEY = "companyInfo"

type UserContextType = {
    user: UserData | null;
    setUser: (user: UserData) => void;
    logout: () => void;
    companyInfo: CompanyInfo | null;
    setCompanyInfo: (companyInfo: CompanyInfo) => void;
};

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<UserData | null>(getItem("userDetails"))
    const [companyInfo, setCompanyInfoState] = useState<CompanyInfo | null>(
        getItem(COMPANY_INFO_STORAGE_KEY)
    )

    const logout = () => setUser(null)

    // PERSIST TO LOCAL STORAGE SO IT SURVIVES RELOADS / IS AVAILABLE BEFORE THE LAYOUT API RESOLVES
    const setCompanyInfo = useCallback((info: CompanyInfo) => {
        setItem(COMPANY_INFO_STORAGE_KEY, info)
        setCompanyInfoState(info)
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, logout, companyInfo, setCompanyInfo }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export const useCompanyInfo = () => useUser().companyInfo
