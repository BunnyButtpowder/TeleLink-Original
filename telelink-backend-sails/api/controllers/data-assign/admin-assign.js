module.exports = {
    friendlyName: 'Branch assignments summary',
  
    description: 'Get a summary of data assignments for all branches, grouped by category and agency.',
  
    inputs: {
      search: {
        type: 'string',
        required: false,
      },
      page: {
        type: 'number',
        required: false,
        defaultsTo: 1,
      },
      limit: {
        type: 'number',
        required: false,
        defaultsTo: 10,
      },
    },
  
    fn: async function (inputs) {
      let { res } = this;
      try {
        const { search, page, limit } = inputs;
  
        let branchQuery = {};
        if (search) {
          branchQuery.name = { contains: search };
        }
  
        const branches = await Agency.find(branchQuery)
          .skip((page - 1) * limit)
          .limit(limit);
  
        if (branches.length === 0) {
          return res.status(404).json({ message: 'Không có chi nhánh nào.' });
        }

        const totalBranches = await Agency.count(branchQuery);
  
        const branchSummaries = [];
  
        for (const branch of branches) {
          const employees = await User.find({ agency: branch.id }).populate('auth');

          const salesmen = employees.filter(emp => emp.auth && emp.auth.role === 3);
  
          const branchSummary = {
            branchId: branch.id,
            branchName: branch.name,
            assignedData: [],
            unassignedData: {},
          };

          for (const salesman of salesmen) {
            const assignedData = await DataAssignment.find({
              user: salesman.id,
              complete: false,
            }).populate('data');
  
            const categoryCounts = assignedData.reduce((acc, item) => {
              const category = item.data?.category || 'Unknown';
              acc[category] = (acc[category] || 0) + 1;
              return acc;
            }, {});
  
            branchSummary.assignedData.push({
              user: salesman.id,
              userName: salesman.fullName,
              totalData: assignedData.length,
              categories: categoryCounts,
            });
          }

          const unassignedData = await Data.find({
            agency: branch.id,
            isDelete: false,
            id: { '!=': (await DataAssignment.find().select(['data'])).map(d => d.data) },
          });
  
          branchSummary.unassignedData = unassignedData.reduce((acc, item) => {
            const category = item.category || 'Unknown';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});
  
          branchSummary.unassignedTotal = unassignedData.length;
          branchSummaries.push(branchSummary);
        }

        return res.ok({
          totalBranches,
          currentPage: page,
          totalPages: Math.ceil(totalBranches / limit),
          branches: branchSummaries,
        });
      } catch (err) {
        console.log(err);
        return res.serverError({ error: 'Có lỗi xảy ra', err });
      }
    },
  };
  