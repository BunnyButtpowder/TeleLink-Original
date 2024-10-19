/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {
  // require('dotenv').config();
  sails.services = require("include-all")({
    dirname: require("path").resolve("api/services"),
    filter: /(.+Service)\.js$/,
    excludeDirs: /^\.(git|svn)$/,
  });

  if ((await Auth.count()) == 0) {
    await Auth.createEach([
      {
        email: "meobeo@gmail.com",
        username: "meobeo",
        password:
          "$2b$10$V5BWlTlI7NxV/38PLy3RweHe78ySzZFGuGcBpGzpBkQz7bTu/Ul0q",
        isActive: 1,
        role: 1,
      },
      {
        email: "minhvu.contactforwork@gmail.com",
        username: "minhvu",
        password:
          "$2b$10$twymI2UzxiLkV6T/TyQbN.JcUgolOEJa6//vfbeXgdgVH/OgKQO7q",
        isActive: 1,
        role: 3,
      },
    ]);
  }

  if ((await User.count()) == 0) {
    await User.createEach([
      {
        fullName: "DM Tuan Cuong",
        phoneNumber: "0974009765",
        address: "Tây Mỗ, Hà Nội",
        dob: "2003-09-21",
        agency: "",
        avatar: "",
        gender: "male",
        dataType: "",
        auth: 1,
      },
      {
        fullName: "Minh Vu",
        phoneNumber: "0928911447",
        address: "Hoàn Kiếm, Hà Nội",
        dob: "2003-07-25",
        agency: "",
        avatar: "",
        gender: "male",
        dataType: "",
        auth: 2,
      },
    ]);
  }

  if ((await Permission.count()) == 0) {
    await Permission.createEach([
      { title: "TestPermission", path: "auth/test-permission", method: "GET" },
    ]);
  }

  if ((await Role.count()) == 0) {
    await Role.createEach([
      { title: "Admin", onlyViewCreateBy: false, permissions: [1] },
      { title: "Salesman", onlyViewCreateBy: false, permissions: [1] },
      { title: "Agency", onlyViewCreateBy: true, permissions: [1] },
    ]);
  }

  if ((await Package.count()) == 0) {
    await Package.createEach([
      {
        code: "20",
        title: "V160N",
        provider: "Viettel",
        type: "Trả trước",
        price: "160000",
      },
      {
        code: "21",
        title: "V250N",
        provider: "Viettel",
        type: "Trả trước",
        price: "250000",
      },
    ]);
  }

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
};
