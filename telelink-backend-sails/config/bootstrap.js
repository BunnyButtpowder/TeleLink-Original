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
  const dataImportCron = require('../cron-job/data-import-cron');
  dataImportCron.start();
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
        role: 1,
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

        avatar: "",
        gender: "male",
        dataType: "",
        auth: 2,
      },
    ]);
  }

  // if ((await Permission.count()) == 0) {
  //   await Permission.createEach([
  //     { title: "TestPermission", path: "auth/test-permission", method: "GET" },
  //   ]);
  // }

  if ((await Role.count()) == 0) {
    await Role.createEach([
      { title: 'Admin', onlyViewCreateBy: false, permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
      { title: 'Agency', onlyViewCreateBy: false, permissions: [2, 6, 7, 8, 11, 14, 15, 16] },
      { title: 'Salesman', onlyViewCreateBy: false, permissions: [7, 8] }
    ])
  }

  if ((await Permission.count()) == 0) {
    await Permission.createEach([
      {
        "title": "GetAllData",
        "path": "data/getall",
        "method": "GET"
      },
      {
        "title": "GetAgencyData",
        "path": "data/agency",
        "method": "GET"
      },
      {
        "title": "ImportData",
        "path": "import-data",
        "method": "POST"
      },
      {
        "title": "GetAllPackages",
        "path": "packages/getall",
        "method": "GET"
      },
      {
        "title": "GetAllBlacklist",
        "path": "blacklists/getall",
        "method": "GET"
      },
      {
        "title": "GetAgencyBlacklist",
        "path": "blacklists/agency",
        "method": "GET"
      },
      {
        "title": "GetSalemanBlacklist",
        "path": "blacklists/salesman",
        "method": "GET"
      },
      {
        "title": "GetAllCallResults",
        "path": "result/getall",
        "method": "GET"
      },
      {
        "title": "AssignDataAdminAgency",
        "path": "data-assign/agency",
        "method": "POST"
      },
      {
        "title": "AssignDataAdminSaleman",
        "path": "data-assign/admin-user",
        "method": "POST"
      },
      {
        "title": "AssignDataAgencySaleman",
        "path": "data-assign/agency-user",
        "method": "POST"
      },
      {
        "title": "CreatePackage",
        "path": "package",
        "method": "POST"
      },
      {
        "title": "CreateAgency",
        "path": "users/create",
        "method": "POST"
      },
      {
        "title": "CreateSalesman",
        "path": "users/saleman",
        "method": "POST"
      },
      {
        "title": "DeleteAccount/BanAccount",
        "path": "users/delete",
        "method": "DELETE"
      },
      {
        "title": "ExportReport",
        "path": "export-report",
        "method": "GET"
      },
    ])
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