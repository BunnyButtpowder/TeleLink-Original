module.exports = {
  friendlyName: 'Branch assignments summary',

  description: 'Get a summary of data assignments for each user in a branch, grouped by category, with search and pagination.',

  inputs: {
    id: {
      type: "number",
      required: false,
    },
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
      const { id, search, page, limit } = inputs;


      let employees;
      if (id) {

        employees = await User.find({ agency: id }).populate('auth');
        if (employees.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy nhân viên nào thuộc chi nhánh này.' });
        }
      } else {

        employees = await User.find().populate('auth');
        if (employees.length === 0) {
          return res.status(404).json({ message: 'Không có nhân viên nào trong hệ thống.' });
        }
      }


      let salesmen = employees.filter(emp => emp.auth && emp.auth.role === 3);

      if (salesmen.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên bán hàng nào.' });
      }


      if (search) {
        const lowerCaseSearch = search.toLowerCase();
        salesmen = salesmen.filter(salesman =>
          salesman.fullName && salesman.fullName.toLowerCase().includes(lowerCaseSearch)
        );
      }

      if (salesmen.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên phù hợp với từ khóa tìm kiếm.' });
      }


      const totalSalesmen = salesmen.length;
      const totalPages = Math.ceil(totalSalesmen / limit);
      const currentPage = Math.min(Math.max(page, 1), totalPages);
      const paginatedSalesmen = salesmen.slice((currentPage - 1) * limit, currentPage * limit);


      const summary = [];

      for (const salesman of paginatedSalesmen) {

        const agency = await Agency.findOne({ id: salesman.agency });
        const agencyName = agency ? agency.name : 'Unknown';

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
          agency: agencyName,
          totalData: assignedData.length,
          categories: categoryCounts
        });
      }

      if (summary.length === 0) {
        return res.status(404).json({ message: 'Không có dữ liệu nào được phân công.' });
      }

      return res.ok({
        data: summary,
        pagination: {
          totalItems: totalSalesmen,
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
