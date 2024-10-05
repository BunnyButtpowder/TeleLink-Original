/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
  'POST /import-data': (req, res) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error("Multer Error: ", err); // Ghi log lỗi từ multer
        return res.badRequest({ error: 'Có lỗi xảy ra khi tải lên tệp.' });
      }
  
      // Kiểm tra file được tải lên
      if (!req.file) {
        return res.badRequest({ error: 'Không có tệp được tải lên' });
      }
  
      // Chuyển tiếp tới action sau khi upload thành công
      return DataController.importData(req, res); // Giả sử bạn đã định nghĩa importData trong DataController
    });
  },
};
