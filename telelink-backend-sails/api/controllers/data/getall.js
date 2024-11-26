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
      let filters = { isDelete: false };

      if (placeOfIssue) {
        filters.placeOfIssue = { contains: placeOfIssue };
      }
      if (networkName) {
        filters.networkName = { contains: networkName };
      }

      let dataQuery = Data.find(filters);

      if (searchTerm) {
        const data = await Data.find({
          isDelete: false,
          or: [
            { placeOfIssue: { 'like': '%' + searchTerm.toLowerCase() + '%' } },
            { networkName: { 'like': '%' + searchTerm.toLowerCase() + '%' } },
            { category: { 'like': '%' + searchTerm.toLowerCase() + '%' } },
          ]
        });
      }

      // const data = await Data.find({
      //   isDelete: false
      // });

      dataQuery = dataQuery.skip((page - 1) * limit).limit(limit);
      
      if (sort && order) {
        dataQuery.sort(`${sort} ${order}`);
      }

      const data = await dataQuery;
      if (data.length === 0) {
        return res.notFound({ message: 'Không tìm thấy dữ liệu phù hợp.' });
      }
      const totalCount = await Data.count(filters);
      const totalPages = Math.ceil(totalCount / limit);

      return res.ok({ data: data,
        count: data.length,
        totalCount: totalCount,
        totalPages: totalPages,
        currentPage: page,
        perPage: limit, });

    } catch (err) {
      console.log(err)
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu.' });
    }
  }
};
