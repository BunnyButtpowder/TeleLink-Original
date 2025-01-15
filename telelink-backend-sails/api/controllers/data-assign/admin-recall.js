module.exports = {
    friendlyName: 'Recall data from agency by category',
  
    description: 'Thu hồi dữ liệu từ một chi nhánh theo category và cập nhật trạng thái dữ liệu.',
  
    inputs: {
      agencyId: {
        type: 'number',
        required: true,
        
      },
      categories: {
        type: 'ref',
        required: true,
      }
    },
  
    fn: async function (inputs) {
      let { res } = this;
      try {
        const { agencyId, categories } = inputs;
  
        const agency = await Agency.findOne({ id: agencyId });
  
        if (!agency) {
          return res.status(404).json({ message: 'Không tìm thấy chi nhánh hợp lệ.' });
        }
  
        const dataToRecall = await Data.find({
          agency: agencyId,
          isDelete: false,
          category: { in: categories } 
        });
  
        if (dataToRecall.length === 0) {
          return res.status(404).json({ message: 'Không có dữ liệu nào thuộc category được chỉ định để thu hồi từ chi nhánh này.' });
        }
  
        // Cập nhật agency thành null cho các bản ghi phù hợp
        await Data.update({
          agency: agencyId,
          isDelete: false,
          category: { in: categories }
        }).set({ agency: null });
  
        return res.ok({ 
          message: 'Thu hồi dữ liệu thành công.', 
          recalledCount: dataToRecall.length 
        });
  
      } catch (err) {
        console.log(err);
        return res.serverError({ error: 'Có lỗi xảy ra.', err });
      }
    }
  };
  