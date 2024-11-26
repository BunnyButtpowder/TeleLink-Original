module.exports = {

    friendlyName: 'Get All or Search Data',

    description: 'Lấy tất cả dữ liệu hoặc tìm kiếm theo từ khóa.',

    inputs: {
        networkName: {
            type: 'string',
            required: true,
        }
    },


    fn: async function (inputs) {
        let { res } = this;
        try {
            const { networkName } = inputs;
            let filters = { agency:null,isDelete: false, networkName: { contains: networkName } };
            let dataQuery = Data.find(filters);
            const data = await dataQuery;
            if (data.length === 0) {
                return res.notFound({ message: 'Không tìm thấy dữ liệu nào phù hợp với từ khoá.' });
            }
            return res.ok({ count: data.length });

        } catch (err) {
            console.log(err)
            return res.serverError({ error: 'Có lỗi xảy ra khi lấy hoặc tìm kiếm dữ liệu.' });
        }
    }
};
