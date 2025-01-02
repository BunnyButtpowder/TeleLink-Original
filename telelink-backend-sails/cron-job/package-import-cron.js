const cron = require('node-cron');
const fs = require('fs');


const ImportPackage = require('../api/controllers/ImportPackage');



module.exports = {
  start: function () {
    cron.schedule('* * * * *', async () => {
        console.log('Quá trình xử lý lịch trình package');
      try {
        const pendingImports = await ScheduledPackage.find({
          isProcessed: false,
          scheduledDate: { '<=': new Date() },
        });

        for (const importRequest of pendingImports) {
          const { filePath, id, user } = importRequest;

          if (!fs.existsSync(filePath)) {
            console.error(`File không tồn tại: ${filePath}`);
            continue;
          }

          await ImportPackage.importPackage(filePath, user);
          await ScheduledData.update({ id }, { isProcessed: true });
        }
      } catch (err) {
        console.error('Lỗi trong quá trình xử lý lịch trình:', err.message);
      }
    });
  },
};
