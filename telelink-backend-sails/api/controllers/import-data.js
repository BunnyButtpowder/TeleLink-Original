const XLSX = require('xlsx');
const fs = require('fs');

module.exports = {
  friendlyName: 'Import data',

  description: 'Nhập dữ liệu từ file Excel được tải lên vào bảng Data',

  inputs: {
    file: {
      type: 'ref',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Dữ liệu đã được nhập thành công từ file Excel.',
    },
    badRequest: {
      description: 'Có lỗi xảy ra khi xử lý file Excel.',
    },
  },

  fn: async function (inputs) {
    let { res } = this;

    try {
      const uploadedFile = inputs.file;
      console.log("Uploaded file: ", uploadedFile);

      if (!uploadedFile) {
        return res.badRequest({ error: 'Không có tệp được tải lên' });
      }

      
      const workbook = XLSX.readFile(uploadedFile.fd || uploadedFile.path);
      const sheetName = workbook.SheetNames[0]; 
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
      for (const row of worksheet) {
        await Data.create({
          noi_cap_data: row.noi_cap_data,
          phan_loai_data: row.phan_loai_data,
          so_thue_bao: row.so_thue_bao,
          goi_hien_tai: row.goi_hien_tai,
          goi_uu_tien_1: row.goi_uu_tien_1,
          goi_uu_tien_2: row.goi_uu_tien_2,
          ngay_dang_ky: new Date(row.ngay_dang_ky),
          ngay_het_han: new Date(row.ngay_het_han),
          ghi_chu: row.ghi_chu,
          TKC: row.TKC,
          APRU_3thang: row.APRU_3thang,
          tieu_dung_n1: row.tieu_dung_n1,
          tieu_dung_n2: row.tieu_dung_n2,
          tieu_dung_n3: row.tieu_dung_n3,
          tieu_dung_TKC: row.tieu_dung_TKC,
          tieu_dung_thoai: row.tieu_dung_thoai,
          tieu_dung_data: row.tieu_dung_data,
          dung_data_ngoai_goi: row.dung_data_ngoai_goi,
          khac_1: row.khac_1,
          khac_2: row.khac_2,
          khac_3: row.khac_3
        });
      }

      return res.json({ message: 'Dữ liệu đã được nhập thành công!' });

    } catch (err) {
      return res.serverError({ error: 'Có lỗi xảy ra trong quá trình nhập dữ liệu', details: err.message });
    }
  }
};
