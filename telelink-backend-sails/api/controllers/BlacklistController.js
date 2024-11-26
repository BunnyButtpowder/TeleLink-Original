const XLSX = require('xlsx');
const fs = require('fs');

module.exports = {
  importBlacklist: async function (req, res, filePath, id) {
    try {

      console.log(id)

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      function normalizeString(str) {
        return str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '')
          .replace(/đ/g, 'd')
          .toLowerCase();
      }

      const headers = worksheet[0].map(header => normalizeString(header));
      console.log('Headers after normalization:', headers);

      const columnMapping = {
        'sotb': 'SDT',
        'loaiso': 'note'
      };

      const headerIndexes = {};
      for (const [normalizedHeader, field] of Object.entries(columnMapping)) {
        const index = headers.indexOf(normalizeString(normalizedHeader));
        if (index !== -1) {
          headerIndexes[field] = index;
        } else {
          return res.badRequest({ message: `Không tìm thấy cột cho trường: ${normalizedHeader}` });
        }
      }

      for (let i = 1; i < worksheet.length; i++) {
        const row = worksheet[i];
        let SDT = row[headerIndexes['SDT']] || '';
        // SDT = String(SDT);

        // if (SDT && !SDT.startsWith('0')) {
        //   SDT = '0' + SDT;
        // }

        const existingBlacklist = await Blacklist.findOne({ where: { SDT } });

        if (existingBlacklist) {
          await Blacklist.destroy({ id: existingBlacklist.id });
        }

        await Blacklist.create({
          SDT: SDT,
          note: row[headerIndexes['note']] || '',
          user: id
        });
      }
      fs.unlinkSync(filePath);

      return res.ok({ message: 'Dữ liệu blacklist được nhập thành công' });

    } catch (err) {
      console.error('Error during importing blacklist data: ', err);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.serverError({ message: 'Có lỗi xảy ra trong quá trình nhập dữ liệu blacklist.', err });
    }
  },
};
