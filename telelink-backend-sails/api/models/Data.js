/**
 * Data.js
 *
 * @description :: Model đại diện cho bảng 'Data' trong cơ sở dữ liệu.
 */

module.exports = {
  attributes: {
   

    noi_cap_data: {
      type: 'string',
      required: true,
      
    },

    phan_loai_data: {
      type: 'string',
      required: true,
      
    },

    so_thue_bao: {
      type: 'number',
      required: true,
     
    },

    goi_hien_tai: {
      type: 'string',
      allowNull: true,
      
    },

    goi_uu_tien_1: {
      type: 'string',
      allowNull: true,
      
    },

    goi_uu_tien_2: {
      type: 'string',
      allowNull: true,
     
    },

    ngay_dang_ky: {
      type: 'ref',
      columnType: 'date',
      
    },

    ngay_het_han: {
      type: 'ref',
      columnType: 'date',
      
    },

    ghi_chu: {
      type: 'string',
      allowNull: true,
      
    },

    TKC: {
      type: 'string',
      allowNull: true,
     
    },

    APRU_3thang: {
      type: 'string',
      allowNull: true,
      
    },

    tieu_dung_n1: {
      type: 'string',
      allowNull: true,
      
    },

    tieu_dung_n2: {
      type: 'string',
      allowNull: true,
      
    },

    tieu_dung_n3: {
      type: 'string',
      allowNull: true,
     
    },

    tieu_dung_TKC: {
      type: 'string',
      allowNull: true,
      
    },

    tieu_dung_thoai: {
      type: 'string',
      allowNull: true,
      
    },

    tieu_dung_data: {
      type: 'string',
      allowNull: true,
      
    },

    dung_data_ngoai_goi: {
      type: 'string',
      allowNull: true,
      
    },

    khac_1: {
      type: 'string',
      allowNull: true,
     
    },

    khac_2: {
      type: 'string',
      allowNull: true,
      
    },

    khac_3: {
      type: 'string',
      allowNull: true,
      
    },
  },
};
