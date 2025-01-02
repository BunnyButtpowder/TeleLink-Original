module.exports = {

    fn: async function(input) {
        const { res } = this;
        try {
            const data = await ScheduledPackage.find({
                isProcessed: false,
            });
            return res.ok({ message: 'Danh sách dữ liệu đã được lên lịch.', data });
        } catch (err) {
            console.log(err);
            return res.serverError({ error: "Đã xảy ra listring khi lìm danh sách.", details: err.message });
        }
    }
}