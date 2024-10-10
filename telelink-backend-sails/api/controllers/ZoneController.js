
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

    create: async function (req, res) {
        const { code, title } = req.body;
        try {

            if (!code && !title) {
                return res.badRequest({ message: "Cần ít nhất một giá trị để cập nhật." });
            }
            
            const existingCode = await Zone.findOne({code});
            if (existingCode) {
                return res.status(422).json({ message: "Code đã tồn tại rồi" });
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
            if (!code && !title) {
                return res.status(400).json({ message: "Cần ít nhất một giá trị để cập nhật." });
            }
            const zone = await Zone.findOne({ id });

            if (!zone) {
                return res.status(404).json({ message: "Chi nhánh không tồn tại." });
            }

            const updates = {};
            if (code) updates.code = code;
            if (title) updates.title = title;

            if (code) {
                const existingCode = await Zone.findOne({ code });
                if (existingCode) {
                    return res.status(422).json({ message: "Code đã tồn tại rồi" });
                }
            }            

            await Zone.updateOne({ id: zone.id }).set(updates);
    
            return res.json({ message: "Chi nhánh đã được cập nhật thành công." });
        } catch (error) {
            console.error('Error in edit:', error);
            return res.status(500).json({ message: "Lỗi hệ thống.", error });
        }
    },
    delete: async function (req, res) {
        const { id } = req.params;
    
        try {
            const zone = await Zone.findOne({ id });
            if (!zone) {
                return res.status(404).json({ message: "Zone not found." });
            }

            if (zone.isDelete) {
                return res.status(400).json({ message: "Zone has already been deleted." });
            }
    
            // Update isDeleted to true (soft delete)
            const updates = {
                isDelete: true,
            };
            const updatedZone = await Zone.updateOne({ id }).set(updates);
    
            if (!updatedZone) {
                return res.status(500).json({ message: "Unable to delete the zone." });
            }
    
            return res.json({ message: "Zone successfully soft-deleted.", zone: updatedZone });
        } catch (error) {
            console.error('Error in delete:', error);
            return res.status(500).json({ message: "Internal server error.", error });
        }
    }    
};

