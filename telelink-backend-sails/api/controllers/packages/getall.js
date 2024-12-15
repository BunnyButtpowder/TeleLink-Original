module.exports = {

  friendlyName: 'GetAllPackages',

  description: 'Lấy tất cả các gói dịch vụ với tìm kiếm, sắp xếp và phân trang.',

  inputs: {
    searchTerm: {
      type: 'string',
      required: false,
    },
    sort: {
      type: 'string',
      required: false,
    },
    order: {
      type: 'string',
      required: false,
      isIn: ['asc', 'desc'],
    },
    provider: {
      type: 'string',
      required: false,
    },
    type: {
      type: 'string',
      required: false,
    },
    page: {
      type: 'number',
      required: false,
      defaultsTo: 1, // Trang mặc định là 1
    },
    limit: {
      type: 'number',
      required: false,
      defaultsTo: 10, 
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    let { res } = this;

    try {
      const { searchTerm, sort, order, provider, type, page, limit } = inputs;
      let filters = { isDelete: false };

      if (provider) {
        filters.provider = { contains: provider };
      }
      if (type) {
        filters.type = { contains: type };
      }

      // Nếu có searchTerm, thêm vào các điều kiện tìm kiếm
      if (searchTerm) {
        filters.or = [
          { title: { contains: searchTerm.toLowerCase() } },
          { provider: { contains: searchTerm.toLowerCase() } },
        ];
      }

      let packageQuery = Package.find(filters);

      if (sort && order) {
        packageQuery = packageQuery.sort(`${sort} ${order}`);
      }

      const skip = (page - 1) * limit;

      packageQuery.skip(skip).limit(limit);

      const packageData = await packageQuery;
      const totalCount = await Package.count(filters);

      if (packageData.length === 0) {
        return res.ok({ 
          message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu', 
          data: [], 
          count: 0, 
          total: totalCount 
        });
      }

      return res.ok({
        message: 'Đây là danh sách các gói dịch vụ',
        data: packageData,
        count: packageData.length,
        total: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      });

    } catch (err) {
      console.log(err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu.' });
    }
  }
};
