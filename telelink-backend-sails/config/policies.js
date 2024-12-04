/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/
  // "*": ["getAuth","getPermission"],
  "auth/login": true,
  '*': ["getAuth"],
  'auth/verifyToken': 'getAuth',
  'data/getall': ["getAuth","checkPermission"],
  'data/agency': ["getAuth","checkPermission"],
  'import-data': ["getAuth","checkPermission"],
  'packages/getall': ["getAuth","checkPermission"],
  'blacklists/getall': ["getAuth","checkPermission"],
  'blacklists/agency': ["getAuth","checkPermission"],
  'blacklists/salesman': ["getAuth","checkPermission"],
  'result/getall': ["getAuth","checkPermission"],
  'data-assign/agency': ["getAuth","checkPermission"],
  'data-assign/admin-user': ["getAuth","checkPermission"],
  'data-assign/agency-user': ["getAuth","checkPermission"],
  // "auth/test-permission": ["getAuth","checkPermission"]
};
