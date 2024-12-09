module.exports = {
  friendlyName: "Get",

  description: "Get rehandle.",

  inputs: {
    result: {
      type: "number",
      require: false,
    },
    searchTerm: {
      type: "string",
      description: "Từ khóa tìm kiếm",
      required: false,
    },
    sort: {
      type: "string",
      required: false,
    },
    order: {
      type: "string",
      required: false,
      isIn: ["asc", "desc"],
    },
  },

  exits: {},

  fn: async function (inputs) {
    const { req, res, next } = this;
    const userId = req.user.id;
    let { searchTerm, result, sort, order } = inputs;
    const resultInput = result ? result : undefined;
    const sortOrder = sort && order ? `${sort} ${order}` : undefined;

    let criteria = {
      user: userId,
      latestResult: resultInput,
      complete: false,
      or: searchTerm
        ? [
            { subcriberNumber: { like: `%${searchTerm.toLowerCase()}%` } },
            { customerName: { like: `%${searchTerm.toLowerCase()}%` } },
            { note: { like: `%${searchTerm.toLowerCase()}%` } },
            { dateToCall: { like: `%${searchTerm.toLowerCase()}%` } },
          ]
        : undefined,
    };
    const assignment = await DataRehandle.find({
      where: criteria,
      sort: sortOrder,
    }).populate("data");

    if (assignment.length === 0) {
      return res.ok({
        message: searchTerm
          ? "Không tìm thấy dữ liệu phù hợp."
          : "Không có dữ liệu",
      });
    }

    return res.ok({
      message: `list of rehandle data: `,
        data: assignment,
        count: assignment.length,
    });
  },
};
