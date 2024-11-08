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
    }
  },

  exits: {},

  fn: async function (inputs, exits) {
    let { res } = this;

    try {
      const { searchTerm, sort, order, placeOfIssue, networkName } = inputs;
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

        if (data.length === 0) {
          return res.ok({ message: 'Không tìm thấy dữ liệu phù hợp.', data: [], count: 0 });
        }

        return res.ok({ data: data, count: data.length });
      }

      // const data = await Data.find({
      //   isDelete: false
      // });
      
      if (sort && order) {
        dataQuery.sort(`${sort} ${order}`);
      }

      const data = await dataQuery;

      return res.ok({ data: data, count: data.length });

    } catch (err) {
      console.log(err)
      return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu.' });
    }
  }
};
