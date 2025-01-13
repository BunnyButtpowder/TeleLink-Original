module.exports = {
    friendlyName: 'Branch assignments summary',
  
    description: 'Get a summary of data assignments for all branches, grouped by category, with search and pagination.',
  
    inputs: {
      search: {
        type: "string",

      },
      page: {
        type: "number",
        defaultsTo: 1,
     
      },
      limit: {
        type: "number",
        defaultsTo: 10,
  
      }
    },
  
    fn: async function (inputs) {
      let { res } = this;
      try {
        const { search, page, limit } = inputs;
  

        let branches = await Agency.find();
  
        if (branches.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy chi nhánh nào.' });
        }

        if (search) {
          const lowerCaseSearch = search.toLowerCase();
          branches = branches.filter(branch =>
            branch.name && branch.name.toLowerCase().includes(lowerCaseSearch)
          );
        }
  
        if (branches.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy chi nhánh phù hợp với từ khóa tìm kiếm.' });
        }
  
        // Phân trang
        const totalBranches = branches.length;
        const totalPages = Math.ceil(totalBranches / limit);
        const currentPage = Math.min(Math.max(page, 1), totalPages);
        const paginatedBranches = branches.slice((currentPage - 1) * limit, currentPage * limit);
  
        const summary = [];
  
        for (const branch of paginatedBranches) {
          const employees = await User.find({ agency: branch.id }).populate('auth');
  
          if (employees.length === 0) {
            summary.push({
              agencyID: branch.id,
              agencyName: branch.name,
              totalUsers: 0,
              totalData: 0,
              categories: {}
            });
            continue;
          }
  
        
          const salesmen = employees.filter(emp => emp.auth && emp.auth.role === 3);
  
          if (salesmen.length === 0) {
            summary.push({
              branchId: branch.id,
              branchName: branch.name,
              totalUsers: 0,
              totalData: 0,
              categories: {}
            });
            continue;
          }
  
          let totalData = 0;
          const categoryCounts = {};
  
          for (const salesman of salesmen) {
            const assignedData = await DataAssignment.find({
              user: salesman.id,
              complete: false
            }).populate('data');
  
            totalData += assignedData.length;
  
            assignedData.forEach(item => {
              const category = item.data?.category || 'Unknown';
              categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
          }
  
          summary.push({
            branchId: branch.id,
            branchName: branch.name,
            totalUsers: salesmen.length,
            totalData,
            categories: categoryCounts
          });
        }
  
        if (summary.length === 0) {
          return res.status(404).json({ message: 'Không có dữ liệu nào được phân công trong các chi nhánh.' });
        }
  
        return res.ok({
          data: summary,
          pagination: {
            totalItems: totalBranches,
            totalPages,
            currentPage,
            limit
          }
        });
      } catch (err) {
        console.log(err);
        return res.serverError({ error: 'Có lỗi xảy ra', err });
      }
    }
  };
  