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

      const AgencyExit = await Agency.findOne({ id: agencyId });
      if (!AgencyExit) {
        return this.res.notFound({ message: "không tìm thấy chi nhánh." });
      }

      const sortOrder = sort && order ? `${sort} ${order}` : undefined;
      const skip = (page - 1) * limit;

      let branchData;
      if (searchTerm) {
        branchData = await Data.find({
          where: {
            agency: agencyId,
            or: [
              { placeOfIssue: { like: `%${searchTerm.toLowerCase()}%` } },
              { networkName: { like: `%${searchTerm.toLowerCase()}%` } },
              { category: { like: `%${searchTerm.toLowerCase()}%` } },
            ],
          },
          sort: sortOrder,
          skip: skip,
          limit: limit,
        });
      } else {
        branchData = await Data.find({
          where: { agency: agencyId },
          sort: sortOrder,
          skip: skip,
          limit: limit,
        });
      }

      const totalCount = await Data.count({ agency: agencyId });
      const totalPages = Math.ceil(totalCount / limit);

      if (branchData.length === 0) {
        return res.ok({ message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu' });
      }

      return this.res.ok({
        message: `Đây là danh sách data của agency với ID ${agencyId}`,
        data: branchData,
        pagination: {
          totalCount: totalCount,
          totalPages: totalPages,
          currentPage: page,
          limit: limit,
        },
      });

    } catch (err) {
      console.log(err);
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu.' });
    }
  }
};
