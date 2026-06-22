"use client"
import React, { createContext, ReactNode, useContext } from "react"
import { BannerOfferResponse } from "@/models/Offer.model"

const OffersContext = createContext<BannerOfferResponse[]>([])

export const OffersProvider = ({
  offers,
  children
}: {
  offers: BannerOfferResponse[]
  children: ReactNode
}) => {
  return <OffersContext.Provider value={offers}>{children}</OffersContext.Provider>
}

export const useOffers = () => useContext(OffersContext)
