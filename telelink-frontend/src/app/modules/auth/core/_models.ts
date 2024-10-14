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
  role?: number
}

export interface UserModel {
  id: number
  fullName?: string
  phoneNumber?: string
  dob?: string | null
  address?: string | null
  agency?: string | null
  avatar?: string
  gender?: string
  dataType?: string
  auth: AuthInfo
  isDelete?: boolean
  createdAt?: number
  updatedAt?: number
  // occupation?: string
  // companyName?: string
  // phone?: string
  // roles?: Array<number>
  // pic?: string
  // timeZone?: string
  // emailSettings?: UserEmailSettingsModel
  // auth?: AuthModel
  // communication?: UserCommunicationModel
  // address?: UserAddressModel
  // socialNetworks?: UserSocialNetworksModel
}
