/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

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
};
