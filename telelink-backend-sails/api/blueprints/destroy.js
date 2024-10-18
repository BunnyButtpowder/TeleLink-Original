var _ = require('@sailshq/lodash');
var formatUsageError = require('sails/lib/hooks/blueprints/formatUsageError.js');

/**
 * Soft Delete One Record
 *
 * http://sailsjs.com/docs/reference/blueprint-api/destroy
 *
 * Soft-deletes the single model instance by updating `isDeleted` to `true`
 * instead of physically removing the record.
 */

module.exports = function destroyOneRecord(req, res) {

    var parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions;

    // Set the blueprint action for parseBlueprintOptions.
    req.options.blueprintAction = 'destroy';

    var queryOptions = parseBlueprintOptions(req);
    var Model = req._sails.models[queryOptions.using];

    var criteria = {};
    criteria[Model.primaryKey] = queryOptions.criteria.where[Model.primaryKey];

    // Find the record to soft delete
    var query = Model.findOne(_.cloneDeep(criteria), queryOptions.populates).meta(queryOptions.meta);
    query.exec(function foundRecord(err, record) {
        if (err) {
            // If this is a usage error coming back from Waterline (e.g., bad criteria), return 400.
            // Otherwise, return 500 for unexpected errors.
            switch (err.name) {
                case 'UsageError': return res.badRequest(formatUsageError(err, req));
                default: return res.serverError(err);
            }
        }

        if (!record) {
            return res.notFound('No record found with the specified `id`.');
        }

        // Instead of destroying, perform a soft delete by updating `isDeleted` to true
        Model.update(_.cloneDeep(criteria)).set({ isDelete: true }).meta({ fetch: true }).exec(function softDeletedRecord(err, updatedRecord) {
            if (err) {
                switch (err.name) {
                    case 'UsageError': return res.badRequest(formatUsageError(err, req));
                    default: return res.serverError(err);
                }
            }

            // If pubsub is enabled, publish the update (soft delete)
            if (req._sails.hooks.pubsub) {
                Model._publishUpdate(criteria[Model.primaryKey], updatedRecord[0], !req._sails.config.blueprints.mirror && req, { previous: record });
                if (req.isSocket) {
                    Model.subscribe(req, [updatedRecord[0][Model.primaryKey]]);
                }
            }

            // Return the updated (soft-deleted) record
            return res.ok(updatedRecord[0]);
        });
    });
};
