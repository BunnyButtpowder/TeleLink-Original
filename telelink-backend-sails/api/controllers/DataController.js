const XLSX = require('xlsx');
const fs = require('fs');

module.exports = {
  importData: async function (req, res, filePath) {
    try {

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      if (!worksheet || worksheet.length === 0) {
        throw new Error("File Excel không chứa dữ liệu.");
      }


      function normalizeString(str) {
        return str
          ?.normalize('NFD')
          ?.replace(/[\u0300-\u036f]/g, '')
          ?.replace(/\s+/g, '')
          ?.replace(/đ/g, 'd')
          ?.toLowerCase();
      }


      const headers = worksheet[0].map((header) => normalizeString(header));


      const cleanedWorksheet = worksheet.slice(1).filter((row) =>
        row.some((cell) => cell && cell.toString().trim() !== '')
      );
      console.log(`Tổng số dòng ban đầu: ${worksheet.length}`);
      console.log(`Tổng số dòng sau khi loại bỏ dòng trống: ${cleanedWorksheet.length}`);


      if (cleanedWorksheet.length === 0) {
        throw new Error("Không có dữ liệu hợp lệ sau khi loại bỏ các dòng trống.");
      }




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
        'apru3thang': 'APRU3Months',
        'tieudungn1': 'usageMonth1',
        'tieudungn2': 'usageMonth2',
        'tieudungn3': 'usageMonth3',
        'tieudungn4': 'usageMonth4',
        'goicuoc': 'Package',
        'tieudungtkc': 'totalTKCUsage',
        'tieudungthoai': 'voiceUsage',
        'tieudungdata': 'dataUsage',
        'dungdatangoaigoi': 'outOfPackageDataUsage',
        'khac1': 'other1',
        'khac2': 'other2',
        'khac3': 'other3',
      };


      const headerIndexes = {};
      const missingColumns = [];
      for (const [normalizedHeader, field] of Object.entries(columnMapping)) {
        const index = headers.indexOf(normalizeString(normalizedHeader));
        if (index === -1) {
          missingColumns.push(normalizedHeader);
        } else {
          headerIndexes[field] = index;
        }
      }

      if (missingColumns.length > 0) {
        throw new Error(`Các cột bị thiếu trong Excel: ${missingColumns.join(', ')}`);
      }


      const validData = [];
      const skippedRows = [];
      cleanedWorksheet.forEach((row, index) => {
        const subscriberNumber = row[headerIndexes['subscriberNumber']] || '';
        const networkName = row[headerIndexes['networkName']] || '';
        const category = row[headerIndexes['category']] || '';

        if (!subscriberNumber || !networkName || !category) {
          skippedRows.push(index + 2);
          return;
        }
        // function parseDate(dateValue) {
        //   if (!dateValue) return null;


        //   if (typeof dateValue === 'number' && !isNaN(dateValue)) {
        //     const excelStartDate = new Date(1900, 0, 1); 
        //     const offset = 24 * 60 * 60 * 1000; 
        //     const excelDate = new Date(excelStartDate.getTime() + (dateValue - 1) * offset); 

        //     return excelDate.toISOString().split('T')[0]; 
        //   }

        //   // Nếu là chuỗi ngày hợp lệ
        //   const parsed = new Date(dateValue);
        //   return isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0]; // Trả về định dạng YYYY-MM-DD
        // }

        validData.push({
          subscriberNumber,
          placeOfIssue: row[headerIndexes['placeOfIssue']] || '',
          networkName,
          category,
          currentPackage: row[headerIndexes['currentPackage']] || '',
          priorityPackage1: row[headerIndexes['priorityPackage1']] || '',
          priorityPackage2: row[headerIndexes['priorityPackage2']] || '',
          registrationDate: row[headerIndexes['registrationDate']] || null,
          expirationDate: row[headerIndexes['expirationDate']] || null,
          notes: row[headerIndexes['notes']] || '',
          TKC: row[headerIndexes['TKC']] || '',
          APRU3Months: row[headerIndexes['APRU3Months']] || '',
          usageMonth1: row[headerIndexes['usageMonth1']] || '',
          usageMonth2: row[headerIndexes['usageMonth2']] || '',
          usageMonth3: row[headerIndexes['usageMonth3']] || '',
          usageMonth4: row[headerIndexes['usageMonth4']] || '',
          Package: row[headerIndexes['Package']] || '',
          totalTKCUsage: row[headerIndexes['totalTKCUsage']] || '',
          voiceUsage: row[headerIndexes['voiceUsage']] || '',
          dataUsage: row[headerIndexes['dataUsage']] || '',
          outOfPackageDataUsage: row[headerIndexes['outOfPackageDataUsage']] || '',
          other1: row[headerIndexes['other1']] || '',
          other2: row[headerIndexes['other2']] || '',
          other3: row[headerIndexes['other3']] || '',
        });
      });

      if (validData.length === 0) {
        throw new Error("Không có dữ liệu hợp lệ để nhập.");
      }
      const uniqueNumbers = new Set(validData.map(item => item.subscriberNumber));
      console.log('Số thuê bao duy nhất:', uniqueNumbers.size);

      const subscriberNumbers = validData.map((item) => item.subscriberNumber);
      const deleteResult = await Data.destroy({ subscriberNumber: subscriberNumbers }).fetch();
      const deletedDataIds = deleteResult.map((record) => record.id);

      console.log(`Đã xóa ${deletedDataIds.length} bản ghi trong bảng Data.`);

      if (deletedDataIds.length > 0) {

        const deleteAssignResult = await DataAssignment.destroy({ data: deletedDataIds }).fetch();
        console.log(`Đã xóa ${deleteAssignResult.length} bản ghi trong bảng DataAssign.`);
      }

      const createResult = await Data.createEach(validData).fetch();

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // const subscriberNumbers = validData.map((item) => item.subscriberNumber);
      // const existingSubscribers = await Data.find({ where: { subscriberNumber: subscriberNumbers } });
      // const existingMap = new Map(existingSubscribers.map((item) => [item.subscriberNumber, item]));
      // const dataToUpdate = [];
      // const dataToCreate = [];
      // validData.forEach((item) => {
      //   if (existingMap.has(item.subscriberNumber)) {
      //     const existing = existingMap.get(item.subscriberNumber);
      //     dataToUpdate.push({
      //       ...existing,
      //       ...item,
      //     });
      //   } else {
      //     dataToCreate.push(item);
      //   }
      // });
      // for (const data of dataToUpdate) {
      //   await Data.update({ id: data.id }).set(data);
      // }
      // if (dataToCreate.length > 0) {
      //   await Data.createEach(dataToCreate);
      // }


      // if (fs.existsSync(filePath)) {
      //   fs.unlinkSync(filePath);
      // }

      return res.ok({
        message: `Xử lý hoàn tất:  Đã xóa ${deleteResult.length} bản ghi cũ. Đã thêm mới ${createResult.length} bản ghi.`,
        skippedRows,
      });
    } catch (err) {
      console.error('Lỗi trong quá trình nhập dữ liệu:', err.message);


      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }


      return res.serverError({
        message: 'Có lỗi xảy ra trong quá trình nhập dữ liệu.',
        error: err.message,
      });
    }
  },
};
