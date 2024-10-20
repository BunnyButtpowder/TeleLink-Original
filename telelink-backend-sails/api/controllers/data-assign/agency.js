

module.exports = {

  friendlyName: 'Assign random data',

  description: 'Chia data ngẫu nhiên cho chi nhánh được chọn với số lượng chỉ định.',

  inputs: {
    agencyId: {
      type: 'string',
      required: true,
      description: 'ID của chi nhánh sẽ nhận data',
    },
    quantity: {
      type: 'number',
      required: true,
      min: 1,
      description: 'Số lượng data muốn phân bổ cho chi nhánh',
    },
  },

  fn: async function (inputs) {
    const { agencyId, quantity } = inputs;

    // // Kiểm tra quyền admin
    // if (!this.req.me.isAdmin) {
    //   return this.res.forbidden({ message: 'Bạn không có quyền thực hiện hành động này.' });
    // }

    
    const branch = await Agency.findOne({ id: agencyId });
    if (!branch) {
      return this.res.notFound({ message: 'Chi nhánh không tồn tại.' });
    }

    const availableData = await Data.find({ agency: null });
    if (availableData.length === 0) {
      return this.res.notFound({ message: 'Không có data nào sẵn có.' });
    }

    if (quantity > availableData.length) {
      return this.res.badRequest({ message: `Chỉ có ${availableData.length} data sẵn có. Không đủ để phân bổ số lượng yêu cầu.` });
    }

    const shuffledData = availableData.sort(() => 0.5 - Math.random());
    const randomDataToAssign = shuffledData.slice(0, quantity);


    await Promise.all(randomDataToAssign.map(async (data) => {
      await Data.updateOne({ id: data.id }).set({ agency: agencyId });
    }));

    return this.res.ok({
      message: `Đã phân bổ thành công ${quantity} data ngẫu nhiên cho chi nhánh ${branch.name}.`,
      assignedData: randomDataToAssign,
    });
  }
};
