module.exports = {
    friendlyName: 'Get all categories assigned to employee',
  
    description: 'Lấy tất cả danh mục (category) từ dữ liệu đã được phân công cho một nhân viên.',
  
    inputs: {
      id: {
        type: 'number',
        required: true,
        description: 'ID của nhân viên.',
      }
    },
  
    fn: async function (inputs) {
      let { res } = this;
      try {
        const { id } = inputs;
  
       
        const employee = await User.findOne({ id: id }).populate('auth');
        if (!employee || !employee.auth || employee.auth.role !== 3) {
          return res.status(404).json({ message: 'Không tìm thấy nhân viên hợp lệ.' });
        }
  
        const assignedData = await DataAssignment.find({
          user: id,
          complete: false
        });
  
        if (assignedData.length === 0) {
          return res.status(404).json({ message: 'Không có dữ liệu nào được phân công cho nhân viên này.' });
        }
  

        const dataIds = assignedData.map(item => item.data); 
        const dataDetails = await Data.find({ id: { in: dataIds } });
  
        const categories = [...new Set(dataDetails.map(data => data.networkName))];
  
        return res.ok({ categories });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Lỗi khi lấy danh mục.', error });
      }
    },
  };
  