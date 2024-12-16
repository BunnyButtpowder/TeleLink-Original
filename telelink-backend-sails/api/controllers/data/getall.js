module.exports = {

  friendlyName: 'Get All or Search Data',

  description: 'Lấy tất cả dữ liệu hoặc tìm kiếm theo từ khóa.',

  inputs: {
    searchTerm: {
      type: 'string',
      description: 'Từ khóa tìm kiếm',
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
    placeOfIssue: {
      type: 'string',
      required: false,
    },
    networkName: {
      type: 'string',
      required: false,
    },
    page: {
      type: 'number',
      required: false,
      defaultsTo: 1,
      min: 1,
    },
    limit: {
      type: 'number',
      required: false,
      defaultsTo: 10,
      min: 1,
    }

  },

  exits: {},

  fn: async function (inputs, exits) {
    let { res } = this;

    try {
      const { searchTerm, sort, order, placeOfIssue, networkName, page, limit } = inputs;
      let filters = { isDelete: false , agency: null , isBlock: false };

      // Áp dụng bộ lọc nếu có
      if (placeOfIssue) {
        filters.placeOfIssue = { contains: placeOfIssue };
      }
      if (networkName) {
        filters.networkName = { contains: networkName };
      }

      let dataQuery = Data.find(filters);

      // Nếu có từ khóa tìm kiếm, thay đổi query để tìm kiếm
      if (searchTerm) {
        dataQuery = Data.find({
          where: {
            isDelete: false,
            or: [
              { placeOfIssue: { like: `%${searchTerm.toLowerCase()}%` } },
              { networkName: { like: `%${searchTerm.toLowerCase()}%` } },
              { category: { like: `%${searchTerm.toLowerCase()}%` } },
            ]
          }
        });
      }

      // Thêm phân trang và sắp xếp
      const skip = (page - 1) * limit;
      if (sort && order) {
        dataQuery.sort(`${sort} ${order}`);
      }

      dataQuery = dataQuery.skip(skip).limit(limit);

      // Lấy dữ liệu
      const data = await dataQuery;

      // Nếu không có dữ liệu
      if (data.length === 0) {
        return res.ok({
          message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu.',
          data: [],
          count: 0,
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
          perPage: limit,
        });
      }

      // Tính tổng số bản ghi sau khi áp dụng bộ lọc và tìm kiếm
      let totalCount;
      if (searchTerm) {
        // Chờ đợi kết quả của Data.count với điều kiện tìm kiếm
        totalCount = await Data.count({
          where: {
            isDelete: false,
            or: [
              { placeOfIssue: { like: `%${searchTerm.toLowerCase()}%` } },
              { networkName: { like: `%${searchTerm.toLowerCase()}%` } },
              { category: { like: `%${searchTerm.toLowerCase()}%` } },
            ]
          }
        });
      } else {
        // Nếu không có tìm kiếm, sử dụng filters bình thường
        totalCount = await Data.count(filters);
      }

      const totalPages = Math.ceil(totalCount / limit);

      // Trả về kết quả
      return res.ok({
        message: 'Danh sách dữ liệu',
        data: data,
        count: data.length,
        totalCount: totalCount,
        totalPages: totalPages,
        currentPage: page,
        perPage: limit,
      });

    } catch (err) {
      console.log(err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu.' });
    }
  }
};
