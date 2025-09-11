
"use client"
import { UserData } from '@/models/Auth.model'
import { getItem } from '@/utils/services/local-storage.service'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type UserContextType = {
    user: UserData | null;
    setUser: (user: UserData) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<UserData | null>(getItem("userDetails"))

    const logout = () => setUser(null)

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
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