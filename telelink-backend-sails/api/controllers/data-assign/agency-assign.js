module.exports = {
    friendlyName: 'Branch assignments summary',
  
    description: 'Get a summary of data assignments for each user in a branch, grouped by category.',
  
    inputs: {
      id: {
        type: "number",
        required: true,
        description: "ID của chi nhánh."
      }
    },
  
    fn: async function (inputs) {
      let { res } = this;
      try {
        const { id } = inputs;
  
        
        const employees = await User.find({ agency: id }).populate('auth');
  
        if (employees.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy nhân viên nào thuộc chi nhánh này.' });
        }
  
     
        const salesmen = employees.filter(emp => emp.auth && emp.auth.role === 3);
  
        if (salesmen.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy nhân viên bán hàng nào trong chi nhánh này.' });
        }
  
        const summary = [];
  
        for (const salesman of salesmen) {
         
          const assignedData = await DataAssignment.find({
            user: salesman.id,
            complete: false
          }).populate('data');

          const categoryCounts = assignedData.reduce((acc, item) => {
            const category = item.data?.category || 'Unknown';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});
 
          summary.push({
            user: salesman.id,
            userName: salesman.fullName,
            totalData: assignedData.length,
            categories: categoryCounts
          });
        }
  
        if (summary.length === 0) {
          return res.status(404).json({ message: 'Không có dữ liệu nào được phân công trong chi nhánh này.' });
        }
  
        return res.ok(summary);
      } catch (err) {
        console.log(err);
        return res.serverError({ error: 'Có lỗi xảy ra', err });
      }
    }
  };
  