
module.exports = {

    getAll: async function (req, res) {
        try {
            const zones = await Zone.find({ isDelete: false });  
            if (!zones.length) {
                return res.status(404).json({ message: "Chi nhánh không tồn tại." });
            }
            return res.json(zones);
        } catch (error) {
            console.error('Error in getAll:', error);
            return res.status(500).json({ message: "Lỗi hệ thống.", error });
        }
    },

    delete: async function (req, res) {
        const { id } = req.params;
    
        try {
            const zone = await Zone.findOne({ id });
            if (!zone) {
                return res.status(404).json({ message: "Chi nhánh không tồn tại." });
            }

            if (zone.isDelete) {
                return res.status(400).json({ message: "Chi nhánh đã được xóa." });
            }
            const updates = {
                isDelete: true,
            };
            const updatedZone = await Zone.updateOne({ id }).set(updates);
    
            if (!updatedZone) {
                return res.status(500).json({ message: "Không thể xóa chi nhánh" });
            }
    
            return res.json({ message: "Chi nhánh đã được xóa thành công", zone: updatedZone });
        } catch (error) {
            console.error('Error in delete:', error);
            return res.status(500).json({ message: "Lỗi hệ thống.", error });
        }
    }    
};