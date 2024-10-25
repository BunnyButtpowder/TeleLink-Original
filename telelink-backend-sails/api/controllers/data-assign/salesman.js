// api/controllers/DataAssignmentController.js

module.exports = {
  friendlyName: 'Get assigned data by employee',

  description: 'Lấy dữ liệu đã được phân công cho một nhân viên.',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'ID của nhân viên.',
    },
  },

  fn: async function (inputs) {
    let { res } = this;
    try {
      const {id} = inputs;
      const assignedData = await DataAssignment.find({
        user : id,
        complete:false
      });

      const employee = await User.findOne({id:id}).populate('auth')
      console.log(employee)

      if (!employee || !employee.auth || employee.auth.role !== 3) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên hợp lệ.' });
      }

      
      if (assignedData.length === 0) {
        return res.status(404).json({ message: 'Không có dữ liệu nào được phân công cho nhân viên này.' });
      }
      const randomAssignedData = _.sample(assignedData);

     
      const dataDetails = await Data.findOne({ id: randomAssignedData.data });

      const result = {
        ...randomAssignedData,
        dataDetails: dataDetails,
      };

      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu.', error });
    }
  },
};
