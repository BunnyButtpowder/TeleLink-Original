module.exports = {

  friendlyName: 'GetAllPackages',

  description: 'Lấy tất cả các gói dịch vụ với tìm kiếm và sắp xếp.',

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
  },

  exits: {},

  fn: async function (inputs, exits) {
    let { res } = this;

    try {
      const { searchTerm, sort, order, provider, type } = inputs;
      let filters = { isDelete: false };

      // Add provider and type filters if they are provided
      if (provider) {
        filters.provider = { contains: provider };
      }
      if (type) {
        filters.type = { contains: type };
      }

      let packageQuery = Package.find(filters);

      // If a search term is provided, modify the query to search by multiple fields
      if (searchTerm) {
        packageQuery = Package.find({
          where: {
            isDelete: false,
            or: [
              { title: { like: `%${searchTerm.toLowerCase()}%` } },
              { provider: { like: `%${searchTerm.toLowerCase()}%` } },
            ],
          },
        });
      }

      // Apply sorting if both sort and order are provided
      if (sort && order) {
        packageQuery.sort(`${sort} ${order}`);
      }

      // Execute the query and get the data
      const packageData = await packageQuery;

      // Check if data was found, return a message if no results were found
      if (packageData.length === 0) {
        return res.ok({ message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu', data: [], count: 0 });
      }

      // Return the data if found
      return res.ok({
        message: 'Đây là danh sách các gói dịch vụ',
        data: packageData,
        count: packageData.length,
      });

    } catch (err) {
      console.log(err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu.' });
    }
  }
};
