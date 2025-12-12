"use client"

import Image from "next/image"

import FlexRowCenter from "components/flex-box/flex-row-center"

import { getItem } from "@/utils/services/local-storage.service"

export default function LogoWithTitle() {
   const getLogo = ()=>{
        const layout = getItem("layout" )
        // console.warn(layout);
        return layout?.header?.logo
      }
  return (
    <FlexRowCenter flexDirection="column" gap={2} mb={4}>
      <Image width={180} height={30} src={getLogo()} alt="Logo Image" />
       
    </FlexRowCenter>
  )
}
