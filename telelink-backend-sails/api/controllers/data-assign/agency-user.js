const _ = require('lodash');
module.exports = {

  friendlyName: 'Agency user',

  description: '',

  inputs: {
    userIds: {
      type: 'json',
      required: true,
      custom: function(value) {
        return _.isArray(value) && value.every(item => _.isNumber(item));
      }
    },
    quantity: {
      type: 'number',
      required: true,
      custom: function(value) {
        return _.isNumber(value) && value > 0;
      }
    },
    agencyId: {
      type: 'number',
      required: true
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
      const { userIds, quantity, agencyId, network, category } = inputs;
      const unassignedData = await Data.find({
        isDelete: false,
        agency: agencyId,
        networkName: network,
        category: category
      });

      if (unassignedData.length === 0) {
        return res.status(404).json({ message: 'Không còn dữ liệu chưa được phân công.' });
      }

      if (quantity > unassignedData.length) {
        return res.status(400).json({ message: `Chỉ có ${unassignedData.length} dữ liệu sẵn có. Không đủ để phân bổ số lượng yêu cầu.` });
      }

      const quantityPerUser = Math.floor(quantity / userIds.length);
      const remainder = quantity % userIds.length;
      const assignments = [];

      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const employee = await User.findOne({ id: userId }).populate('auth');
        console.log('Employee fetched:', employee);

        if (!employee || !employee.auth || employee.auth.role !== 3) {
          return res.status(404).json({ message: `Không tìm thấy nhân viên hợp lệ với ID ${userId}.` });
        }
        // phan phoi so du
        let userQuantity = quantityPerUser;
        if (i < remainder) {
          userQuantity += 1; 
        }

        const randomData = _.sampleSize(unassignedData, Math.min(userQuantity, unassignedData.length));

        await Promise.all(randomData.map(async (data) => {
          await DataAssignment.create({
            user: employee.id,
            data: data.id,
            assignedAt: new Date(),
          });
          await Data.updateOne({ id: data.id }).set({ isDelete: true, agency: employee.agency });
        }));

        _.remove(unassignedData, data => randomData.includes(data));

        assignments.push({ userId: userId, assignedDataCount: randomData.length });
      }

      return res.status(200).json({
        message: 'Đã phân công dữ liệu thành công cho các nhân viên.',
        assignments: assignments
      });

    } catch (error) {
      return res.serverError({
        message: 'Lỗi khi phân công dữ liệu.',
        error: error.message
      });
    }
  }
};