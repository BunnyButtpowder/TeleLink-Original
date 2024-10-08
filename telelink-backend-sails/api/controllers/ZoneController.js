
module.exports = {
    create: async function (req, res) {
        const { code, title } = req.body;
        try {

            if (!code && !title) {
                return res.badRequest({ message: "Cần ít nhất một giá trị để cập nhật." });
            }
            
            const existingCode = await Zone.findOne({code});
            if (existingCode) {
                return res.status(422).json({ message: "Mã chi nhánh đã tồn tại." });
            }

            const newZone = await Zone.create({
                code,
                title
            }).fetch();
            return res.json({ zone: newZone });
        } catch (error) {
            console.error('Error in create new Zone:', error);
            return res.serverError(error);
        }
    },

    edit: async function (req, res) {
        const { id } = req.params;
        const { code, title } = req.body;
    
        console.log(id);
    
        try {
            // Check if both code and title are empty
            if (!code && !title) {
                return res.status(400).json({ message: "Cần ít nhất một giá trị để cập nhật." });
            }
    
            // Find the zone by id
            const zone = await Zone.findOne({ id });
            if (!zone) {
                return res.status(404).json({ message: "Chi nhánh không tồn tại." });
            }
    
            // Check if code already exists
            if (code) {
                const existingCode = await Zone.findOne({ code });
                if (existingCode) {
                    return res.status(422).json({ message: "Mã chi nhánh đã tồn tại." });
                }
            }
    
            // Create an object to store the updated fields
            const updates = {};
            if (code) updates.code = code;
            if (title) updates.title = title;
    
            // Update the zone with the new data
            await Zone.updateOne({ id: zone.id }).set(updates);
    
            return res.json({ message: "Chi nhánh đã được cập nhật thành công." });
        } catch (error) {
            console.error('Error in edit:', error);
            return res.status(500).json({ message: "Lỗi hệ thống.", error });
        }
    }
    
    
};

