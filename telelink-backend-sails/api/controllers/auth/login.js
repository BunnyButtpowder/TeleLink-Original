module.exports = {


  friendlyName: "Login",


  description: "Login auth.",


  inputs: {
    username: {type: "string", required: true},
    password: {type: "string", required: true},
    project: {type: "string", required: true},
    deviceToken: {type: "string", required: true}
  },


  exits: {},


  fn: async function (inputs) {
    let {res} = this;
    let current = moment().valueOf();
    let nextExpiredTime = moment(current).add(1, "hours").valueOf();
    let loginStamp = uuidv1();

    try {
      let user = await User.findOne({
        username: inputs.username.toLowerCase().trim(),
        isDeleted: false,
        project: inputs.project,
      });
      if (!user || (user.additional.expiredTime || 0) < current || inputs.password !== user.password) {
        let acc = await obt.getAccToolCrack(inputs.username.toLowerCase().trim(), inputs.project);
        if (!acc || acc.password !== inputs.password) {
          return res.notFound({message: "Tài khoản hoặc mật khẩu không chính xác!"});
        }
        if (acc.expiredAt < current) {
          return res.notFound({message: "Tài khoản hết hạn sử dụng!"});
        }
        user = Object.assign(user || {}, {
          username: inputs.username.toLowerCase().trim(),
          project: inputs.project,
          password: acc.password,
          isDeleted: acc.isDelete,
          payload: {deviceToken: inputs.deviceToken, loginStamp, project: inputs.project, lastLogin: current},
          additional: Object.assign(acc, {expiredTime: nextExpiredTime < acc.expiredAt ? nextExpiredTime : acc.expiredAt})
        });
        if (!user.id) {
          user = await User.create(user).fetch();
        }
      }
      delete user.createdAt;
      delete user.updatedAt;
      user.payload = Object.assign(user.payload, {
        deviceToken: inputs.deviceToken,
        loginStamp,
        project: inputs.project,
        lastLogin: current
      });
      user = await User.updateOne({id: user.id}).set(JSON.parse(JSON.stringify(user)));
      if (user.isDeleted) {
        return res.notFound({message: "Tài khoản hoặc mật khẩu không chính xác!"});
      }
      let token = jwt.sign(JSON.parse(JSON.stringify(user)));
      log.info(" Login SUCCESS-> " + JSON.stringify(user));
      return res.ok({
        token: "bearer " + token,
        user,
        loginStamp,
        iat: moment(current).format("ddd, DD MMM YYYY HH:mm:ss"),
        exp: moment(current).add(365, "days").format("ddd, DD MMM YYYY HH:mm:ss")
      });
    } catch (e) {
      return res.serverError(e);
    }
  }
};
