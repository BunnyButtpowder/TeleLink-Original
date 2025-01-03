

module.exports = {
    scheduleImport: async function (req, res, filePath, id, scheduledDate) {
      try {
        const importRequest = await ScheduledPackage.create({
          user: id,
          filePath,
          scheduledDate,
          isProcessed: false,
        }).fetch();
  
        return res.ok({
          message: 'Yêu cầu nhập dữ liệu đã được lên lịch thành công.',
          importId: importRequest.id,
        });
      } catch (err) {
        console.error('Lỗi khi tạo lịch trình nhập dữ liệu:', err.message);
        return res.serverError({
          message: 'Có lỗi xảy ra khi tạo lịch trình nhập dữ liệu.',
          error: err.message,
        });
      }
    },
  };
  