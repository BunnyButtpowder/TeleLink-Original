/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const DataController = require('../api/controllers/DataController');


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
      return DataController.importData(req, res, tempPath);
      
    } catch (err) {
      console.error('Error during file upload: ', err);
      return res.serverError({ error: 'Có lỗi xảy ra khi tải lên tệp.', details: err.message });
    }
  },
  'DELETE /zone/:id': 'ZoneController.delete',

};
