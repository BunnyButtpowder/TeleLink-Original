module.exports = {


  friendlyName: 'Salesman',


  description: 'Salesman data.',


  inputs: {
    id: {
      type: "number",
      required: true
    }
  },





  fn: async function (inputs) {
    let { res } = this;
    try {
      const { id } = inputs;

      const employee = await User.findOne({ id: id }).populate('auth')
      // console.log(employee)

      if (!employee || !employee.auth || employee.auth.role !== 3) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên hợp lệ.' });
      }
      const assignedData = await DataAssignment.find({
        user: id,
        // complete: false
      }).populate("data");
      if (assignedData.length === 0) {
        return res.status(404).json({ message: 'Không có dữ liệu nào được phân công cho nhân viên này.' });
      }
      return res.ok({ data: assignedData, count: assignedData.length });


    } catch (err) {
      console.log(err);
      return res.serverError({ error: 'Có lỗi xảy ra ', err });
    }
    return;

  }


};
