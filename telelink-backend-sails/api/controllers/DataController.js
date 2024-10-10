const XLSX = require('xlsx');
const fs = require('fs');

module.exports = {
  importData: async function (req, res, filePath) {
    try {
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
        'noicapdata': 'placeOfIssue',
        'nhamang': 'networkName',
        'phanloaidata': 'category',
        'sothuebao': 'subscriberNumber',
        'goihientai': 'currentPackage',
        'goiuutien1': 'priorityPackage1',
        'goiuutien2': 'priorityPackage2',
        'ngaydangky': 'registrationDate',
        'ngayhethan': 'expirationDate',
        'ghichu': 'notes',
        'tkc': 'TKC',
        'arpu3thang': 'ARPU3Months',
        'tieudungn1': 'usageMonth1',
        'tieudungn2': 'usageMonth2',
        'tieudungn3': 'usageMonth3',
        'tieudungtkc': 'totalTKCUsage',
        'tieudungthoai': 'voiceUsage',
        'tieudungdata': 'dataUsage',
        'dungdatangoaigoi': 'outOfPackageDataUsage',
        'khac1': 'other1',
        'khac2': 'other2',
        'khac3': 'other3',
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
        await Data.create({
          placeOfIssue: row[headerIndexes['placeOfIssue']] || '',
          networkName: row[headerIndexes['networkName']] || '',
          category: row[headerIndexes['category']] || '',
          subscriberNumber: row[headerIndexes['subscriberNumber']] || '',
          currentPackage: row[headerIndexes['currentPackage']] || '',
          priorityPackage1: row[headerIndexes['priorityPackage1']] || '',
          priorityPackage2: row[headerIndexes['priorityPackage2']] || '',
          registrationDate: row[headerIndexes['registrationDate']] || '',
          registrationDate: row[headerIndexes['registrationDate']] || '',
          expirationDate: row[headerIndexes['expirationDate']] || '',
          notes: row[headerIndexes['notes']] || '',
          TKC: row[headerIndexes['TKC']] || '',
          ARPU3Months: row[headerIndexes['ARPU3Months']] || '',
          usageMonth1: row[headerIndexes['usageMonth1']] || '',
          usageMonth2: row[headerIndexes['usageMonth2']] || '',
          usageMonth3: row[headerIndexes['usageMonth3']] || '',
          totalTKCUsage: row[headerIndexes['totalTKCUsage']] || '',
          voiceUsage: row[headerIndexes['voiceUsage']] || '',
          dataUsage: row[headerIndexes['dataUsage']] || '',
          outOfPackageDataUsage: row[headerIndexes['outOfPackageDataUsage']] || '',
          other1: row[headerIndexes['other1']] || '',
          other2: row[headerIndexes['other2']] || '',
          other3: row[headerIndexes['other3']] || '',
        });
      }

      fs.unlinkSync(filePath);


      return res.ok({ message: 'Dữ liệu được nhập thành công.' });

    } catch (err) {
      sails.log.error('Error importing data:', err);
      return res.serverError({ message: 'Có lỗi xảy ra trong quá trình nhập dữ liệu.' });
    }
  },
};
