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

  if(await Auth.count() == 0){
    await Auth.createEach([
      {email: 'meobeo@gmail.com', username: 'meobeo', password: '$2b$10$V5BWlTlI7NxV/38PLy3RweHe78ySzZFGuGcBpGzpBkQz7bTu/Ul0q', isActive: 1, role: 1}
    ])
  }

  if(await Permission.count() == 0 ){
    await Permission.createEach([
      {title: 'TestPermission', path: 'auth/test-permission', method: "GET"}
    ])
  }

  if(await Role.count() == 0 ){
    await Role.createEach([
      {title: 'Admin', onlyViewCreateBy: false, permissions: [1]}
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
