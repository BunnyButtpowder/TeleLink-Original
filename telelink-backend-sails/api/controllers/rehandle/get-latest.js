module.exports = {
  friendlyName: "Get",

  description: "Get rehandle.",

  inputs: {

  },

  exits: {},

  fn: async function (inputs) {
    const { req, res, next } = this;
    const userId = req.user.id;
    let criteria = {
      user: userId,
      complete: false,
    };
    const assignment = await DataRehandle.find({
      where: criteria,
      sort: `dateToCall desc` 
    }).populate("data").limit(3);

    if (assignment.length === 0) {
      return res.ok({
        message: "Không có cuộc gọi cần xử lý lại",
      });
    }

    return res.ok({
      message: `list of rehandle data: `,
        data: assignment,
        count: assignment.length,
    });
  },
};
