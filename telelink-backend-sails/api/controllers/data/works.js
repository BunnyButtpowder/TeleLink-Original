const _ = require('lodash');

module.exports = {
  friendlyName: 'Update assigned data',

  description: 'Allow employees to update their assigned data',

  inputs: {
    dataId: {
      type: 'number',
      required: true,
      description: 'ID of the data to be updated.'
    },
    userId: {
      type: 'number',
      required: true,
      description: 'ID of the employee updating the data.'
    },
    updates: {
      type: 'json',
      required: true,
      description: 'Data to update. Should include callResults if needed.',
    },
  },

  fn: async function (inputs) {
    const { dataId, userId, updates } = inputs;

    try {
      // Tìm dữ liệu theo ID
      const dataToUpdate = await Data.findOne({ id: dataId });

      if (!dataToUpdate) {
        return this.res.notFound({ message: 'Dữ liệu không tìm thấy.' });
      }

      // Kiểm tra xem nhân viên có quyền cập nhật dữ liệu này hay không
      const assignment = await DataAssignment.findOne({ data: dataId, user: userId });

      if (!assignment) {
        return this.res.forbidden({ message: 'Bạn không có quyền cập nhật dữ liệu này.' });
      }


      if (updates.callResults && Array.isArray(updates.callResults)) {

        const currentCallResults = dataToUpdate.callResults || [];


        const newCallResults = _.uniq([...currentCallResults, ...updates.callResults]);


        await Data.updateOne({ id: dataId }).set({
          ...updates,
          callResults: newCallResults,
        });
        await DataAssignment.updateOne({ data: dataId }).set({ complete: true });


        if (newCallResults.includes("Không đồng ý")) {
          dataToUpdate.rejectionCount += 1;
          if (dataToUpdate.rejectionCount >= 3) {
            await Data.destroyOne({ id: dataId });
            await DataAssignment.destroyOne({ data: dataId })
          } else {
            await Data.updateOne({ id: dataId }).set({ rejectionCount: dataToUpdate.rejectionCount });
          }
        } else if (newCallResults.includes("Đồng ý")) {
          await Data.destroyOne({ id: dataId });
          await DataAssignment.destroyOne({ data: dataId });
        }
        else if (newCallResults.includes("Mất đơn")) {
          await Data.destroyOne({ id: dataId });
          await DataAssignment.destroyOne({ data: dataId });
        } else {
          await Data.updateOne({ id: dataId }).set(updates);
        }
      }


      return this.res.ok({
        message: 'Cập nhật dữ liệu thành công.',
        updatedData: updates,
      });

    } catch (error) {
      return this.res.serverError({
        message: 'Lỗi khi cập nhật dữ liệu.',
        error: error.message,
      });
    }
  },
};
