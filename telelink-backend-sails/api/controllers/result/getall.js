module.exports = {
  friendlyName: "Getall",

  description: "Getall result.",

  inputs: {
    agencyId: {
      type: "string",
      required: false,
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
    let { res } = this;
    let { agencyId, searchTerm, sort, order } = inputs;

    if (agencyId) {
      const AgencyExist = await Agency.findOne({ id: agencyId });
      if (!AgencyExist) {
        return this.res.notFound({ message: "không tìm thấy chi nhánh." });
      }
    }
    else{
      agencyId = undefined
    }
    const sortOrder = sort && order ? `${sort} ${order}` : undefined;


    let branchData;
    if (searchTerm) {
      branchData = await Result.find({
        where: {
          agency: agencyId,
          or: [
            { subscriberNumber: { like: `%${searchTerm.toLowerCase()}%` } },
            { customerName: { like: `%${searchTerm.toLowerCase()}%` } },
            { note: { like: `%${searchTerm.toLowerCase()}%` } },
            { address: { like: `%${searchTerm.toLowerCase()}%` } },
            { dataPackage: { like: `%${searchTerm.toLowerCase()}%` } },
          ],
        },
        sort: sortOrder, 
      });
      console.log(searchTerm);
      
    } else {
      branchData = await Result.find({
        where: { agency: agencyId },
        sort: sortOrder,
      });
      console.log(searchTerm);
      
    }
    if (branchData.length === 0) {
      return res.ok({ message: searchTerm ? 'Không tìm thấy dữ liệu phù hợp.' : 'Không có dữ liệu' });
    }

    return this.res.ok({
      message: `list of result: `,
      data: branchData,
    });
    // All done.

  },
};
