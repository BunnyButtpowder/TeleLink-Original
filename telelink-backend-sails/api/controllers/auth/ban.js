module.exports = {

    inputs: {
        id: { type: "number", required: true },
        isBan: { type: "boolean", required: true }  
    },

    exits: {},

    fn: async function (inputs) {
        let { res, req } = this;
        try {
            const { id, isBan } = inputs;
            const auth = await Auth.findOne({ id });

            if (!auth) {
                return res.notFound({ message: "Không tìm thấy tài khoản." });
            }  
            await Auth.update({ id: auth.id }).set({ isActive: isBan });
            if (isBan) {
                return res.json({ message: "Tài khoản đã được mở khóa." });
            } else {
                return res.json({ message: "Tài khoản bị ban." });
            }

        } catch (err) {
            console.log(err);
            return res.serverError({ error: "Đã xảy ra lỗi", details: err.message });
        }
    }
};
