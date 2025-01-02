const fs = require('fs');

module.exports = {
    inputs: {
        id: {
            type: 'string',
            required: true,
        },
    },
    fn: async function (inputs) {
        const { res } = this;
        try {
            
            const data = await ScheduledData.findOne({
                id: inputs.id,
                isProcessed: false,
            });

            if (!data) {
                return res.notFound({ message: 'Không tìm thấy dữ liệu cần xóa.' });
            }

            // Kiểm tra nếu filePath tồn tại
            if (fs.existsSync(data.filePath)) {
                fs.unlinkSync(data.filePath); 
                console.log(`Đã xóa file: ${data.filePath}`);
            } else {
                console.warn(`File không tồn tại tại đường dẫn: ${data.filePath}`);
            }

            // Xóa bản ghi trong database
            await ScheduledData.destroyOne({ id: inputs.id });

            return res.ok({ message: 'Xóa dữ liệu thành công.' });
        } catch (err) {
            console.error('Lỗi khi xóa dữ liệu:', err.message);
            return res.serverError({ error: "Đã xảy ra lỗi khi xóa dữ liệu.", details: err.message });
        }
    },
};
