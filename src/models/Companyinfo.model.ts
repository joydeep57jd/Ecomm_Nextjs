
export interface CompanyInfo {
    companyid:                   number;
    name:                        string;
    pincoderq:                   boolean;
    address:                     Address;
    email:                       Email;
    phoneno:                     Phoneno;
    url:                         null;
    termsncondnord:              null;
    imagepath:                   string;
    termsncondnpayment:          null;
    about:                       null;
    theme:                       Theme;
    brands:                      Brand[];
    footer:                      Footer;
    currency:                    Currency;
    facebook:                    string;
    showFacebookOnline:          boolean;
    instagram:                   string;
    showInstagramOnline:         boolean;
    twitter:                     string;
    showTwitterOnline:           boolean;
    contactEmail:                string;
    showContactEmailOnline:      boolean;
    contactPhone:                string;
    showContactPhoneOnline:      boolean;
    googleClientId:              null;
    faceBookApiId:               null;
    isPhonePeActive:             boolean;
    companyLogo:                 string;
    companyFooterLogo:           string;
    googleMapApiKey:             null;
    googleClientSecret:          null;
    showState:                   boolean;
    showCity:                    boolean;
    showDistrict:                boolean;
    favIconFileName:             string;
    adminPhoneCode:              string;
    servicePhoneCode:            string;
    adminPhoneCountryCode:       string;
    servicePhoneCountryCode:     string;
    companyPaymentMethod:        CompanyPaymentMethod[];
    menuType:                    number;
    isDescriptionPrimary:        boolean;
    announcementText:            string;
    announcementTextColor:       string;
    announcementBackgroundColor: string;
    showItemlevelButton:         boolean;
    isEmailMandatory:            boolean;
}

export interface Address {
    line1: string;
    address1: string;
    address2: string;
    pin:      string;
    state:    string;
    country:  string;
}

export interface Brand {
    id:    number;
    text:  string;
    image: string;
}

export interface CompanyPaymentMethod {
    paymentGatewayId: number;
    name:             string;
    default:          boolean;
}

export interface Currency {
    currencyMasterId: number;
    countryCode:      string;
    currencyCode:     string;
    currencySymbol:   string;
}

export interface Email {
    custservice: string;
    admin:       string;
}

export interface Footer {
    tradeLicenseDtl:              TradeLicenseDtl;
    tinNoDtl:                     TinNoDtl;
    aboutUsDtl:                   AboutUsDtl;
    contactUsDtl:                 ContactUsDtl;
    privacyPolicyDtl:             PrivacyPolicyDtl;
    termsAndConditionsDtl:        TermsAndConditionsDtl;
    footerPaymentApiBannerDtl:    FooterPaymentAPIBannerDtl;
    cancellation_RefundPolicyDtl: CancellationRefundPolicyDtl;
    returnPolicyDtl:              ReturnPolicyDtl;
}

export interface AboutUsDtl {
    aboutUs:     null;
    showAboutUs: boolean;
    isHtml:      boolean;
}

export interface CancellationRefundPolicyDtl {
    cancellation_RefundPolicy:     null;
    showCancellation_RefundPolicy: boolean;
    isHtml:                        boolean;
}

export interface ContactUsDtl {
    contactUs:     null;
    showContactUs: boolean;
    isHtml:        boolean;
}

export interface FooterPaymentAPIBannerDtl {
    footerPaymentApiBanner:     null;
    showFooterPaymentApiBanner: boolean;
    isHtml:                     boolean;
}

export interface PrivacyPolicyDtl {
    privacyPolicy:     null;
    showPrivacyPolicy: boolean;
    isHtml:            boolean;
}

export interface ReturnPolicyDtl {
    returnPolicy:     null;
    showReturnPolicy: boolean;
    isHtml:           boolean;
}

export interface TermsAndConditionsDtl {
    termsAndConditions:     null;
    showTermsAndConditions: boolean;
    isHtml:                 boolean;
}

export interface TinNoDtl {
    tinNo:     null;
    showTINNo: boolean;
    isHtml:    boolean;
}

export interface TradeLicenseDtl {
    tradeLicenseNo:     null;
    showTradeLicenseNo: boolean;
    isHtml:             boolean;
}

export interface Phoneno {
    custservice: null;
}

export interface Theme {
    id:                  number;
    name:                null;
    imageratio:          null;
    color:               null;
    card_type:           null;
    desktop_card_height: null;
    mobile_card_height:  null;
}
