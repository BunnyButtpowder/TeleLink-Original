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
    networkName: {
      type: 'string',
      required: false
    }
  },

  fn: async function (inputs) {
    let { res } = this;
    try {
      const {id,networkName} = inputs;
      const assignedData = await DataAssignment.find({
        user : id,
        complete:false
      });

      const employee = await User.findOne({id:id}).populate('auth')

      if (!employee || !employee.auth || employee.auth.role !== 3) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên hợp lệ.' });
      }

      
      if (assignedData.length === 0) {
        return res.status(404).json({ message: 'Không có dữ liệu nào được phân công cho nhân viên này.' });
      }
      const randomAssignedData = _.sample(assignedData);

     
      const dataDetails = await Data.findOne({ id: randomAssignedData.data });

      if (networkName && dataDetails.networkName !== networkName) {
        return res.status(404).json({ message: 'Không có dữ liệu phù hợp với danh mục được yêu cầu.' });
      }

      let packageUpdate = ""
      let package = dataDetails.Package.split(",");
      package.push(dataDetails.currentPackage);
      for (i in package) {
        package[i] = package[i].toUpperCase().trim();
      }
      console.log(package);
      

      const packageList = await Package.find({ title: { in: package } });

      for (i in packageList) {
        if(i!=0)
          packageUpdate = packageUpdate.concat(`, ${packageList[i].title}`)
        else
          packageUpdate = packageUpdate.concat(`${packageList[i].title}`)
      } 
      dataDetails.Package = packageUpdate
      console.log(packageUpdate);
      

      const result = {
        ...randomAssignedData,
        dataDetails: dataDetails,
      };
      
      return res.ok(result);
    } catch (error) { 
      console.log(error)
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu.', error });
    }
  },
};
