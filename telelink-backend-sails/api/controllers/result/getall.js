module.exports = {
  friendlyName: "Getall",

  description: "Getall result.",

  inputs: {
    saleman: {
      type: "string",
      required: false,
    },
    agencyId: {
      type: "string",
      required: false,
    },
    result: {
      type: "number",
      require: false,
    },
    searchTerm: {
      type: "string",
      description: "Từ khóa tìm kiếm",
      required: false,
    },
    date: {
      type: "string",
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
    let { res } = this;
    let { saleman, agencyId, searchTerm, date, result, sort, order } = inputs;

    if (agencyId) {
      const AgencyExist = await Agency.findOne({ id: agencyId });
      if (!AgencyExist) {
        return this.res.notFound({ message: "không tìm thấy chi nhánh." });
      }
    } else {
      agencyId = undefined;
    }

    if (saleman) {
      const salemanExist = await User.findOne({ id: saleman });
      if (!salemanExist) {
        return this.res.notFound({ message: "không tìm thấy saleman." });
      }
    } else {
      saleman = undefined;
    }
    let startDate, endDate;
    if (date) {
      const [month, year] = date.split("-");
      startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    }

    const resultInput = result ? result : undefined;
    const sortOrder = sort && order ? `${sort} ${order}` : undefined;

    const criteria = {
      saleman: saleman,
      agency: agencyId,
      result: resultInput,
      or: searchTerm ? [
        { subscriberNumber: { like: `%${searchTerm.toLowerCase()}%` } },
        { customerName: { like: `%${searchTerm.toLowerCase()}%` } },
        { note: { like: `%${searchTerm.toLowerCase()}%` } },
        { address: { like: `%${searchTerm.toLowerCase()}%` } },
        { dataPackage: { like: `%${searchTerm.toLowerCase()}%` } },
      ] : undefined,
    };

    if (startDate && endDate) {
      criteria.createdAt = { '>=': startDate, '<=': endDate };
    }

    try {
      let branchData = await Result.find({
        where: criteria,
        sort: sortOrder,
      })
        .populate("saleman")
        .populate("agency");

      if (branchData.length === 0) {
        return res.ok({
          message: searchTerm
            ? "Không tìm thấy dữ liệu phù hợp."
            : "Không có dữ liệu",
        });
      }

      return this.res.ok({
        message: `list of result: `,
        data: branchData,
        count: branchData.length,
      });
    } catch (error) {
      return res.serverError({
        message: "Error fetching call results",
        error: error.message
      });
    }
  },
};
