/**
 * Data.js
 *
 * @description :: Model representing the 'Data' table in the database.
 */

module.exports = {
  attributes: {
   
    placeOfIssue: {    // "noi_cap_data"
      type: 'string',
      required: true,
    },

    category: {    // "phan_loai_data"
      type: 'string',
      required: true,
    },

    subscriberNumber: {    // "so_thue_bao"
      type: 'number',
      required: true,
    },

    currentPackage: {    // "goi_hien_tai"
      type: 'string',
      allowNull: true,
    },

    priorityPackage1: {    // "goi_uu_tien_1"
      type: 'string',
      allowNull: true,
    },

    priorityPackage2: {    // "goi_uu_tien_2"
      type: 'string',
      allowNull: true,
    },

    registrationDate: {    // "ngay_dang_ky"
      type: 'ref',
      columnType: 'date',
    },

    expirationDate: {    // "ngay_het_han"
      type: 'ref',
      columnType: 'date',
    },

    notes: {    // "ghi_chu"
      type: 'string',
      allowNull: true,
    },

    TKC: {    // "TKC"
      type: 'string',
      allowNull: true,
    },

    ARPU3Months: {    // "APRU_3thang"
      type: 'string',
      allowNull: true,
    },

    usageMonth1: {    // "tieu_dung_n1"
      type: 'string',
      allowNull: true,
    },

    usageMonth2: {    // "tieu_dung_n2"
      type: 'string',
      allowNull: true,
    },

    usageMonth3: {    // "tieu_dung_n3"
      type: 'string',
      allowNull: true,
    },

    totalTKCUsage: {    // "tieu_dung_TKC"
      type: 'string',
      allowNull: true,
    },

    voiceUsage: {    // "tieu_dung_thoai"
      type: 'string',
      allowNull: true,
    },

    dataUsage: {    // "tieu_dung_data"
      type: 'string',
      allowNull: true,
    },

    outOfPackageDataUsage: {    // "dung_data_ngoai_goi"
      type: 'string',
      allowNull: true,
    },

    other1: {    // "khac_1"
      type: 'string',
      allowNull: true,
    },

    other2: {    // "khac_2"
      type: 'string',
      allowNull: true,
    },

    other3: {    // "khac_3"
      type: 'string',
      allowNull: true,
    },
  },
};
