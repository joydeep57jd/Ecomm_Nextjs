"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'


const Login = () => {
  const router = useRouter()

  useEffect(() => {
    router.back()
  }, [])

  return (
    <></>
  )
}

export default Login