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
      type: 'number',
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
    registrationDate: {    // Ngày đăng kí
      type: 'ref',
      columnType: 'date',
    },
    expirationDate: {    // Ngày hết hạn
      type: 'ref',
      columnType: 'date',
    },
    notes: {    // Ghi chú
      type: 'string',
      allowNull: true,
    },
    TKC: {    // TKC
      type: 'string',
      allowNull: true,
    },
    ARPU3Months: {    // APRU 3 tháng
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

   // Kết quả cuộc gọi
    callResults: {    
      type: 'json',  
      defaultsTo: [], 
      
    },

    rejectionCount: {
      type: 'number',
      defaultsTo: 0, 
    },
  },


  beforeUpdate: async function (data, proceed) {
    
    if (data.callResults && data.callResults.includes("không nghe máy")) {
      data.rejectionCount += 1;
      if (data.rejectionCount >= 3) {
        await Data.destroyOne({ id: data.id }); // Xóa bản ghi nếu rejectionCount >= 3
      }
    }

    return proceed();
  },
};
