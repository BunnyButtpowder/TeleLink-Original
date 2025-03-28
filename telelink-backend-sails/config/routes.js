/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const BlacklistController = require('../api/controllers/BlacklistController');
const DataController = require('../api/controllers/DataController');
const PackageController = require('../api/controllers/PackageController');
const scheduleImport = require('../api/controllers/scheduleImport');
const schedulePackage = require('../api/controllers/schedulePackage');
const fs = require('fs');


module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": { view: "index" },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
  // "POST /token": {action: "auto-thanlong-mobile/token"},
  // "GET /api/Account/UserInfo": {action: "auto-thanlong-mobile/user-info"},
  // "POST /api/Account/CheckAuthorize": {
  //   action: "auto-thanlong-mobile/check-authorize",
  // },

  // "POST /api/vcb": "VcbController.vcb",
  // "POST /api/vcb/login": "VcbController.login",
  // "GET /fshare/:id": "FshareController.download",
  // "POST /proxy/:serviceKey/:endPointDelegate": "ProxyController.index",
  // "GET /store/checklic.php": "CrackAirController.checklic",
  // "GET /store/activate.php": "CrackAirController.activate"
  // 'POST /auth/change-password/:id': 'AuthController.changePassword',
  // 'POST /auth/change/:id': { action: 'auth/change' },

  'POST /auth/verify_token': {
    action: 'auth/verify-token',
    policy: 'getAuth',
  },

  'POST /import-data': async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files uploaded');
        return res.badRequest({ error: 'Không có tệp được tải lên' });
      }

      const uploadedFile = req.files.file;
      console.log(uploadedFile);
      const tempPath = __dirname + '/tmp/' + uploadedFile.name;
      await uploadedFile.mv(tempPath);
      console.log('File uploaded to: ', tempPath);
      const id = req.body.id;
      return DataController.importData(req, res, tempPath, id);
    } catch (err) {
      console.error('Error during file upload: ', err);
      return res.serverError({ error: 'Có lỗi xảy ra khi tải lên tệp.', details: err.message });
    }
  },
  'POST /import-blacklist': async (req, res) => {
    try {

      if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files uploaded');
        return res.badRequest({ error: 'Không có tệp được tải lên' });
      }

      const uploadedFile = req.files.file;
      console.log(uploadedFile);
      const tempPath = __dirname + '/tmp/' + uploadedFile.name;
      await uploadedFile.mv(tempPath);
      console.log('File uploaded to: ', tempPath);
      const id = req.body.id;
      // console.log(id);
      return BlacklistController.importBlacklist(req, res, tempPath, id);

    } catch (err) {
      console.error('Error during file upload: ', err);
      return res.serverError({ error: 'Có lỗi xảy ra khi tải lên tệp.', details: err.message });
    }
  }, 'POST /import-package': async (req, res) => {
    try {

      if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files uploaded');
        return res.badRequest({ error: 'Không có tệp được tải lên' });
      }

      const uploadedFile = req.files.file;
      console.log(uploadedFile);
      const tempPath = __dirname + '/tmp/' + uploadedFile.name;
      await uploadedFile.mv(tempPath);
      console.log('File uploaded to: ', tempPath);
      const id = req.body.id;
      // console.log(id);
      return PackageController.importPackage(req, res, tempPath, id);

    } catch (err) {
      console.error('Error during file upload: ', err);
      return res.serverError({ error: 'Có lỗi xảy ra khi tải lên tệp.', details: err.message });
    }
  },
  'GET /api/reports/export': 'ReportController.exportReport',
  'POST /api/result/export': 'ResultController.exportResults',
  'POST /schedule-import': async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files uploaded');
        return res.badRequest({ error: 'Không có tệp được tải lên' });
      }

      const uploadedFile = req.files.file;
      console.log(uploadedFile);
      const tempPath = __dirname + '/data/' + uploadedFile.name;
      if (fs.existsSync(tempPath)) {
        console.log('File already exists in the temp directory:', tempPath);
        return res.badRequest({ error: 'Tệp đã tồn tại trong thư mục tạm.' });
      }
      await uploadedFile.mv(tempPath);
      console.log('File uploaded to: ', tempPath);
      const id = req.body.id;
      const scheduledDate = req.body.scheduledDate;
      return scheduleImport.scheduleImport(req, res, tempPath, id,scheduledDate);
    } catch (err) {
      console.error('Error during file upload: ', err);
      return res.serverError({ error: 'Có lỗi xảy ra khi tải lên tệp.', details: err.message });
    }
  },
  'POST /schedule-import-package': async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files uploaded');
        return res.badRequest({ error: 'Không có tệp được tải lên' });
      }

      const uploadedFile = req.files.file;
      console.log(uploadedFile);
      const tempPath = __dirname + '/packages/' + uploadedFile.name;
      if (fs.existsSync(tempPath)) {
        console.log('File already exists in the temp directory:', tempPath);
        return res.badRequest({ error: 'Tệp đã tồn tại trong thư mục tạm.' });
      }
      await uploadedFile.mv(tempPath);
      console.log('File uploaded to: ', tempPath);
      const id = req.body.id;
      const scheduledDate = req.body.scheduledDate;
      return schedulePackage.scheduleImport(req, res, tempPath, id,scheduledDate);
    } catch (err) {
      console.error('Error during file upload: ', err);
      return res.serverError({ error: 'Có lỗi xảy ra khi tải lên tệp.', details: err.message });
    }
  },
  
};
