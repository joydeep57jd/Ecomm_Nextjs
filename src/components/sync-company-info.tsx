"use client"
import { useUser } from "@/contexts/UserContenxt"
import { CompanyInfo } from "@/models/Companyinfo.model"

import { useEffect } from "react"

type Props = { companyInfo?: CompanyInfo }

export default function SyncCompanyInfo({ companyInfo }: Props) {
    const { setCompanyInfo } = useUser()

    useEffect(() => {
        if (companyInfo) setCompanyInfo(companyInfo)
    }, [companyInfo, setCompanyInfo])

    return <></>
}
