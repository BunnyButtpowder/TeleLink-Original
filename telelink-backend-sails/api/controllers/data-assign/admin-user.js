const _ = require('lodash');
module.exports = {


  friendlyName: 'Agency user',


  description: '',



  inputs: {
    quantity: {
      type: 'number',
      required: true,
      min: 1,
    },
    userId: {
      type: 'number',
      required: true,
    },
    network: {
      type: 'string',
      required: true
    },
    category: {
      type: 'string',
      required: true
    },
  },




  exits: {

  },


  fn: async function (inputs) {

    let { res } = this;
    try {
      const { userId, quantity, network,category} = inputs;
      const unassignedData = await Data.find({
        isDelete: false,
        agency: null,
        networkName: network,
        category: category
      });

      if (unassignedData.length === 0) {
        return res.status(404).json({ message: 'Không còn dữ liệu chưa được phân công.' });
      }

      const employee = await User.findOne({ id: userId }).populate('auth');
      console.log('Employee fetched:', employee);

      if (!employee || !employee.auth || employee.auth.role !== 3) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên hợp lệ.' });
      }
      if (quantity > unassignedData.length) {
        return this.res.badRequest({ message: `Chỉ có ${unassignedData.length} data sẵn có. Không đủ để phân bổ số lượng yêu cầu.` });
      }


      const randomData = _.sampleSize(unassignedData, Math.min(quantity, unassignedData.length));

      await Promise.all(randomData.map(async (data) => {
        await DataAssignment.create({
          user: employee.id,
          data: data.id,
          assignedAt: new Date(),
        });
        await Data.updateOne({ id: data.id }).set({ isDelete: true });
      }));

      return res.status(200).json({
        message: 'Đã phân công dữ liệu thành công cho nhân viên.',
        employee: employee,
        data: randomData
      });

    } catch (error) {
      return res.serverError({
        message: 'Lỗi khi phân công dữ liệu.',
        error: error.message
      });
    }
  }


};
