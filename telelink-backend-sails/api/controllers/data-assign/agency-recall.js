module.exports = {
    friendlyName: 'Recall data from employee by category',
  
    description: 'Thu hồi dữ liệu từ một nhân viên theo category và cập nhật trạng thái dữ liệu.',
  
    inputs: {
      userId: {
        type: 'number',
        required: true,
        description: 'ID của nhân viên cần thu hồi dữ liệu.'
      },
      categories: {
        type: 'ref',
        required: true,
        description: 'Danh sách các category muốn thu hồi (một hoặc nhiều).'
      }
    },
  
    fn: async function (inputs) {
      let { res } = this;
      try {
        const { userId, categories } = inputs;
  
        
        const employee = await User.findOne({ id: userId }).populate('auth');
  
        if (!employee || !employee.auth || employee.auth.role !== 3) {
          return res.status(404).json({ message: 'Không tìm thấy nhân viên bán hàng hợp lệ.' });
        }

        const assignedData = await DataAssignment.find({
          user: userId,
          complete: false
        }).populate('data');
  
        if (assignedData.length === 0) {
          return res.status(404).json({ message: 'Nhân viên này không có dữ liệu nào để thu hồi.' });
        }
  
        const filteredData = assignedData.filter(assignment =>
          categories.includes(assignment.data.category)
        );
  
        if (filteredData.length === 0) {
          return res.status(404).json({ message: 'Không có dữ liệu nào thuộc category được chỉ định để thu hồi.' });
        }

        for (const assignment of filteredData) {

          await DataAssignment.destroyOne({ id: assignment.id });
          await Data.updateOne({ id: assignment.data.id }).set({
            isDelete: false
          });
        }
  
        return res.ok({ 
          message: 'Thu hồi dữ liệu thành công.', 
          recalledCount: filteredData.length 
        });
  
      } catch (err) {
        console.log(err);
        return res.serverError({ error: 'Có lỗi xảy ra.', err });
      }
    }
  };
  