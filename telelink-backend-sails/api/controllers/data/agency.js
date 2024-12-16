module.exports = {
  friendlyName: 'View branch data',

  description: 'Xem các dữ liệu đã được phân bổ cho chi nhánh theo agency ID.',

  inputs: {
    agencyId: {
      type: 'string',
      required: true,
    },
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
    },
  },

  fn: async function (inputs) {
    let { res } = this;

    try {
      const { agencyId, searchTerm, sort, order, page, limit } = inputs;

      // Kiểm tra sự tồn tại của agency
      const agencyExists = await Agency.findOne({ id: agencyId });
      if (!agencyExists) {
        return res.notFound({ message: 'Không tìm thấy chi nhánh.' });
      }

      // Xây dựng bộ lọc tìm kiếm
      const searchFilters = { agency: agencyId , isDelete: false };
      if (searchTerm) {
        searchFilters.or = [
          { placeOfIssue: { contains: searchTerm.toLowerCase() } },
          { networkName: { contains: searchTerm.toLowerCase() } },
          { category: { contains: searchTerm.toLowerCase() } },
        ];
      }

      // Tìm tất cả bản ghi phù hợp
      const matchingRecords = await Data.find({ where: searchFilters });
      const totalCount = matchingRecords.length;

      // Tính số trang
      const totalPages = Math.ceil(totalCount / limit);

      // Phân trang dữ liệu
      const sortOrder = sort && order ? `${sort} ${order}` : undefined;
      const skip = (page - 1) * limit;

      const data = await Data.find({
        where: searchFilters,
        sort: sortOrder,
        skip: skip,
        limit: limit,
      });

      // Nếu không có dữ liệu trả về thông báo
      if (data.length === 0) {
        return res.ok({
          message: searchTerm
            ? 'Không tìm thấy dữ liệu phù hợp với từ khóa tìm kiếm.'
            : 'Không có dữ liệu.',
          data: [],
          count: 0,
          totalCount: totalCount,
          totalPages: totalPages,
          currentPage: page,
          perPage: limit,
        });
      }

      // Trả về kết quả
      return res.ok({
        message: `Dữ liệu của agency với ID ${agencyId}`,
        data: data,
        count: data.length,
        totalCount: totalCount,
        totalPages: totalPages,
        currentPage: page,
        perPage: limit,
      });

    } catch (err) {
      console.error(err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu.' });
    }
  },
};
