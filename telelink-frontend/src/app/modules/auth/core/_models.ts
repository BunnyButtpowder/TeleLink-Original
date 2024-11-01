import { Customer } from '../../../pages/customer/customers-list/core/_models'

export interface AuthModel {
  api_token: string
  // refreshToken?: string
}

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: boolean
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserSocialNetworksModel {
  linkedIn: string
  facebook: string
  twitter: string
  instagram: string
}

export interface AuthInfo {
  id?: number
  email?: string
  username: string
  password?: string
  status?: boolean
  role: number
}

export interface Agency {
  id?: number
  name: string
  isDelete?: boolean
  createdAt?: number
  updatedAt?: number
}

export interface UserModel {
  id: number
  fullName?: string
  phoneNumber?: string
  dob?: string | null
  address?: string | null
  agency?: Agency
  avatar?: string
  gender?: string
  dataType?: string
  auth: AuthInfo
  isDelete?: boolean
  createdAt?: number
  updatedAt?: number
  dataDetails?: Customer
}
