/**
 * GetalldataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    fn: async function (inputs) {
        const { res } = this;
        try {
            const data = await ScheduledData.find({
                isProcessed: false,
            });
            return res.ok({message: 'Danh sách dữ liệu đã được lên lịch.' , data});
        } catch (err) {
            console.log(err);
            return res.serverError({ error: "Đã xảy ra listring khi lìm danh sách.", details: err.message });
        }
    }
};

