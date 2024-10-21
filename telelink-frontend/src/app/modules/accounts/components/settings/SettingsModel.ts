export interface IProfileDetails {
  avatar: string;
  fullName: string;
  phoneNumber: string;
  dob?: string;
  address: string;
  agency: string; 
  gender: string;
  role: number;
}

export interface IUpdateEmail {
  newEmail: string;
  confirmPassword: string;
}

export type User = {
  fullName?: string
  phoneNumber?: string
  dob?: string | null
  address?: string | null
  agency?: number
  avatar?: string
  gender?: string
  dataType?: string
  isDelete?: boolean
  createdAt?: number
  updatedAt?: number
}

export interface IUpdatePassword {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

export interface IConnectedAccounts {
  google: boolean;
  github: boolean;
  stack: boolean;
}



export interface IEmailPreferences {
  successfulPayments: boolean;
  payouts: boolean;
  freeCollections: boolean;
  customerPaymentDispute: boolean;
  refundAlert: boolean;
  invoicePayments: boolean;
  webhookAPIEndpoints: boolean;
}

export interface INotifications {
  notifications: {
    email: boolean;
    phone: boolean;
  };
  billingUpdates: {
    email: boolean;
    phone: boolean;
  };
  newTeamMembers: {
    email: boolean;
    phone: boolean;
  };
  completeProjects: {
    email: boolean;
    phone: boolean;
  };
  newsletters: {
    email: boolean;
    phone: boolean;
  };
}

export interface IDeactivateAccount {
  confirm: boolean;
}

// export const profileDetailsInitValues: IProfileDetails = {
//   avatar: "media/avatars/avatar.jpg",
//   fullName: "Minh Vu",
//   agency: "Keenthemes",
//   phoneNumber: "123456789",
//   address: "123 Main St", // Replaced `companySite` with `address`
//   gender: "Male", // Added gender
//   role: 1, // Added role
// };

export const updateEmail: IUpdateEmail = {
  newEmail: "support@keenthemes.com",
  confirmPassword: "",
};

export const updatePassword: IUpdatePassword = {
  currentPassword: "",
  newPassword: "",
  passwordConfirmation: "",
};

export const connectedAccounts: IConnectedAccounts = {
  google: true,
  github: true,
  stack: false,
};

export const emailPreferences: IEmailPreferences = {
  successfulPayments: false,
  payouts: true,
  freeCollections: false,
  customerPaymentDispute: true,
  refundAlert: false,
  invoicePayments: true,
  webhookAPIEndpoints: false,
};

export const notifications: INotifications = {
  notifications: {
    email: true,
    phone: true,
  },
  billingUpdates: {
    email: true,
    phone: true,
  },
  newTeamMembers: {
    email: true,
    phone: false,
  },
  completeProjects: {
    email: false,
    phone: true,
  },
  newsletters: {
    email: false,
    phone: false,
  },
};

export const deactivateAccount: IDeactivateAccount = {
  confirm: false,
};

export const initialUser: User = {
  avatar: "media/avatars/avatar.jpg",
  fullName: "Minh Vu",
  phoneNumber: "123456789",
  address: "123 Main St", // Replaced `companySite` with `address`
  gender: "Male", // Added gender
}