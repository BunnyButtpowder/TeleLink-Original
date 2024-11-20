/**
 * Data.js
 *
 * @description :: Model representing the 'Data' table in the database.
 */

module.exports = {
  attributes: {


    placeOfIssue: {    // Nơi cấp data 
      type: 'string',
      required: true,
    },
    networkName: { // Nhà mạng 
      type: 'string',
      required: true,
    },
    category: {    // Phân loại data
      type: 'string',
      required: true,
    },
    subscriberNumber: {    // Số thuê bao
      type: 'string',
      required: true,
    },
    currentPackage: {    // Gói hiện tại
      type: 'string',
      allowNull: true,
    },
    priorityPackage1: {    // Gói ưu tiên 1
      type: 'string',
      allowNull: true,
    },
    priorityPackage2: {    // Gói ưu tiên 2
      type: 'string',
      allowNull: true,
    },
    registrationDate: {
      type: 'string',
      columnType: 'date',
      allowNull: true,
    },
    expirationDate: {
      type: 'string', 
      columnType: 'date',
      allowNull: true,
    },    
    notes: {    // Ghi chú
      type: 'string',
      allowNull: true,
    },
    TKC: {    // TKC
      type: 'string',
      allowNull: true,
    },
    APRU3Months: {    // APRU 3 tháng
      type: 'string',
      allowNull: true,
    },
    usageMonth1: {    // Tiêu dùng n1
      type: 'string',
      allowNull: true,
    },
    usageMonth2: {    // Tiêu dùng n2
      type: 'string',
      allowNull: true,
    },
    usageMonth3: {    // Tiêu dùng n3
      type: 'string',
      allowNull: true,
    },
    usageMonth4: {    // Tiêu dùng n4
      type: 'string',
      allowNull: true,
    },
    Package: {    // Gói cước
      type: 'string',
      allowNull: true,
    },
    usageMonth4: {    // Tiêu dùng n4
      type: 'string',
      allowNull: true,
    },
    Package: {    // Gói cước
      type: 'string',
      allowNull: true,
    },
    totalTKCUsage: {    // Tiêu dùng TKC
      type: 'string',
      allowNull: true,
    },
    voiceUsage: {    // Tiêu dùng thoại
      type: 'string',
      allowNull: true,
    },
    dataUsage: {    // Tiêu dùng data
      type: 'string',
      allowNull: true,
    },
    outOfPackageDataUsage: {    // Dùng data ngoại gói
      type: 'string',
      allowNull: true,
    },
    other1: {    // Khác 1
      type: 'string',
      allowNull: true,
    },
    other2: {    // Khác 2
      type: 'string',
      allowNull: true,
    },
    other3: {    // Khác 3
      type: 'string',
      allowNull: true,
    },
    agency: {
      model: 'agency',

    },

  }
}