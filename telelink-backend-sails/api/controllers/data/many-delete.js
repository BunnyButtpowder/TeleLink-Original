module.exports = {

  friendlyName: 'Many Delete',

  description: 'Xóa nhiều bản ghi dựa trên các tham số filter.',

  inputs: {
    networkName: {
      type: 'string',
      required: false,
    },
    createdAt: {
      type: 'string',
      required: false,
    }
  },

  fn: async function (inputs) {
    let { res } = this;
    const { networkName, createdAt } = inputs;

    // Kiểm tra input bắt buộc: networkName hoặc createdAt phải được truyền vào
    if (!networkName && !createdAt) {
      return res.badRequest({
        message: 'Cần truyền vào ít nhất một trong hai tham số: networkName hoặc createdAt.',
      });
    }

    try {

      let filters = {};  

      if (networkName) {
        filters.networkName = networkName;  
      }

      if (createdAt) {
        // Kiểm tra xem createdAt có phải là một chuỗi hợp lệ không
        const parsedDate = new Date(createdAt);
        if (isNaN(parsedDate)) {
          return res.badRequest({ message: 'Ngày tạo không hợp lệ.' });
        }

        const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999)).getTime();

        filters.createdAt = { '>=': startOfDay, '<=': endOfDay };  
      }

      const recordsToDelete = await Data.find(filters);

      if (!recordsToDelete || recordsToDelete.length === 0) {
        return res.notFound({ message: 'Không tìm thấy bản ghi nào để xóa' });
      }

      const idsToDelete = recordsToDelete.map((item) => item.id);
      await Data.destroy({ id: { in: idsToDelete } });
      await DataAssignment.destroy({ data: { in: idsToDelete } });

      return res.ok({
        message: `Đã xóa thành công ${recordsToDelete.length} bản ghi.`,
        deletedIds: idsToDelete,
      });

    } catch (error) {
      console.log(error);
      return res.serverError({
        message: 'Đã có lỗi xảy ra khi xóa bản ghi.',
      }); 
    }
  }
};
