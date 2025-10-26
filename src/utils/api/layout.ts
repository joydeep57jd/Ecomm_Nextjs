import LayoutModel from "@/models/Layout.model"
import axios from "../axiosInstance"
// CUSTOM DATA MODEL

import { API_URL } from "../constants"
import { Category } from "@/models/Category.modal"
import { CompanyInfo } from "@/models/Companyinfo.model"

const getLayoutData = async (): Promise<LayoutModel> => {
  let categories: Category[] = []
  let companyInfoData: CompanyInfo

  const [categoryResponse, companyInfoResponse] = await Promise.allSettled([
    axios.post<{ data: Category[] }>(`${API_URL.ITEMS.GET_CATEGORY}`, {}),
    axios.post<{ data: CompanyInfo }>(`${API_URL.MISC.GET_COMPANY_INFO}`, {})
  ])

  if (categoryResponse.status === "fulfilled") {
    categories = categoryResponse.value.data.data
  }

  if (companyInfoResponse.status === "fulfilled") {
    companyInfoData = companyInfoResponse.value.data.data
  }

  return {
    header: {
      categories: [],
      categoryMenus: [],
      logo: companyInfoData!?.companyLogo,
      navigation: categories
    },

    topbar: {
      label: companyInfoData!?.email.custservice,
      languageOptions: {},
      socials: {
        facebook: companyInfoData!?.facebook,
        instagram: companyInfoData!?.instagram,
        twitter: companyInfoData!?.twitter
      },
      title: companyInfoData!?.contactPhone
    },
    footer: {
      about: [companyInfoData!?.footer],
      appStoreUrl: "",
      contact: {
        address: {
          address1: companyInfoData!?.address.address1,
          address2: companyInfoData!?.address.address2 || "",
          pin: companyInfoData!?.address.pin,
          state: companyInfoData!?.address.state,
          country: companyInfoData!?.address.country
        },
        email: companyInfoData!?.email.custservice,
        phone: companyInfoData!?.contactPhone
      },
      customers: [],
      description: "",
      logo: companyInfoData!?.companyFooterLogo,
      playStoreUrl: "",
      socials: {
        facebook: companyInfoData!?.facebook,
        instagram: companyInfoData!?.instagram,
        google: "",
        twitter: companyInfoData!?.twitter,
        youtube: ""
      }
    },
    mobileNavigation: {
      logo: "/logo.png",
      version1: [],
      version2: []
    }
  }
}

export default { getLayoutData }
