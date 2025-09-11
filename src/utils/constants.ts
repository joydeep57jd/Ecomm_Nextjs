export const layoutConstant = {
  topbarHeight: 40,
  headerHeight: 80,
  mobileNavHeight: 64,
  containerWidth: 1200,
  mobileHeaderHeight: 64,
  grocerySidenavWidth: 280
}

export const API_URL = {
  AUTH: {
    LOGIN: "/frontend/CustomerLogin",
    SEND_OTP_FOR_LOGIN: "/frontend/SendOTPForLogin",
    SIGN_UP: "/frontend/CustomerSignup",
    SIGNIN_BY_OTHERS: "/frontend/SigninByOthers",
    FORGOT_PASSWORD: "/frontend/ForgotPassword",
    SEND_FORGOT_PASSWORD_OTP: "/frontend/Sendforgetpasswordotp",
    VERIFY_FORGOT_PASSWORD_OTP: "/frontend/Verifyforgetpasswordotp",
    CHANGE_PASSWORD: "/frontend/ChangeUserPassword"
  },

  USER: {
    GET_PROFILE: "/frontend/GetCustomerProfile",
    SAVE_PROFILE: "/frontend/SaveCustomerProfile",
    GET_DETAILS: "/frontend/GetCustomer?",
    UPDATE_PHONE: "/frontend/UpdateCustomerPhoneNumber",
    GET_WALLET_INFO: "/frontend/GetCustomerWalletInfo",
    GET_ALL_DETAILS: "/frontend/GetCustomerProfile"
  },

  ORDER: {
    GENERATE: "/frontend/GetStatement",
    HISTORY: "/frontend/GetOrderHistory",
    HISTORY_CUSTOMER: "/frontend/GetOrderHistoryCustomer",
    INVOICE: "/frontend/GetStatementInvoice",
    CHECKOUT: "/frontend/CheckOutOrder",
    PLACE_ORDER: "/frontend/PlaceOrder",
    SAVE_PAYMENT: "/frontend/SavePayment",
    CREATE_CANCEL_REQUEST: "/frontend/CreateCancelRequest",
    GET_CANCEL_REASON: "/frontend/GetCancellationMasterFront"
  },

  CART: {
    GET: "/frontend/GetCustomerCartItem",
    SAVE: "/frontend/SaveCustomerCartItem",
    GET_PRICE: "/frontend/CheckCartPrice"
  },

  WISHLIST: {
    GET_CATEGORY: "/frontend/GetWishListCategory",
    GET_ITEMS: "/frontend/GetCustomerWishItems",
    SAVE_ITEM: "/frontend/SaveCustomerWishItem",
    SAVE_CATEGORY: "/frontend/SaveUpdateWishListCategory",
    DELETE_ITEM: "/frontend/DeleteCustomerWishItem",
    DELETE_CATEGORY: "/frontend/DeleteWishListCategoryWithItems",
    REMOVE_ITEM: "/frontend/RemoveCustomerWishItem"
  },

  ITEMS: {
    GET_ALL: "/frontend/GetAllItems",
    GET_ALL_LAZY: "/frontend/GetAllItemsForLazyLoad?",
    GET_BY_VARIANT: "/frontend/GetItemsByVariantIds",
    GET_FEATURED: "/frontend/GetFeatureItems",
    GET_CATEGORY: "/frontend/GetAllCategories",
    GET_ITEM_DETAIL_BY_SECTION: "/frontend/GetItemDetailBySectionFor",
    GET_SECTIONS: "/frontend/GetItemsFromSectionId",
    GET_RELATED: "/frontend/GetRelatedItem",
    GET_SEARCH: "/frontend/GetSearchItems",
    GET_FILTER_OPTIONS: "/frontend/GetItemWiseFilterOptions",
    GET_VARIANT_BY_OPTIONS: "/frontend/GetVariantByOptions",
    GET_ADDITIONAL_INFO: "/frontend/GetAdditionalInfoByItem",
    P_ALLPRODUCT: "/frontend/GetCompanyDefaultTemplateUI"
  },

  RATING: {
    SAVE: "/frontend/SaveRating",
    GET: "/frontend/GetRating"
  },

  PAYMENT: {
    INITIATE_PHONEPE: "/frontend/InitiatePhonePayPayment",
    FETCH_PHONEPE_STATUS: "/frontend/PhonePePaymentStatus",
    CHECK_STATUS: "/frontend/CheckPaymentStatus"
  },

  ADDRESS: {
    ADD: "/frontend/SaveAddress",
    DELETE: "/frontend/DeleteAddress",
    VALIDATE_PIN: "/frontend/ValidatePinCode"
  },

  MISC: {
    GET_COMPANY_INFO: "/frontend/GetCompanyDetails",
    GET_IP: "https://ipinfo.io?token=c49d0e3562b4b7",
    GET_CONFIG: "/frontend/config.json",
    GET_TEMPLATE: "/frontend/GetTemplate",
    VALIDATE_DISCOUNT: "/frontend/ValidateDiscount",
    GET_DELIVERY_CHARGE: "/frontend/GetDeliveryCharge",
    VARIFY_CUSTOMER: "/frontend/VerifyAlreadyCustomer",
    VALIDATE_OTP: "/frontend/VerifyCustomerOTP",
    GET_FAQ: "/frontend/GetFAQ"
  }
}

export default API_URL
