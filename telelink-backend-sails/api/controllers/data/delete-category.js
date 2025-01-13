module.exports = {
    friendlyName: 'Delete data by category',
  
    description: 'Xóa hoàn toàn dữ liệu theo category, ngoại trừ những bản ghi có complete = true trong DataAssignment.',
  
    inputs: {
      categories: {
        type: 'ref',
        required: true,
        description: 'Danh sách các category muốn xóa (một hoặc nhiều).'
      }
    },
  
    fn: async function (inputs) {
      let { res } = this;
      try {
        const { categories } = inputs;

        const dataToDelete = await Data.find({
          category: { in: categories }
        });
  
        if (dataToDelete.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy dữ liệu nào thuộc category được chỉ định để xóa.' });
        }
  
        const dataIdsToDelete = [];
        for (const data of dataToDelete) {
          const relatedAssignments = await DataAssignment.find({
            data: data.id,
            complete: true
          });
  
          if (relatedAssignments.length === 0) {

            dataIdsToDelete.push(data.id);
          }
        }
  
        if (dataIdsToDelete.length === 0) {
          return res.status(404).json({ message: 'Không có dữ liệu nào thỏa mãn điều kiện để xóa.' });
        }
  
        await DataAssignment.destroy({ data: { in: dataIdsToDelete } });
        await Data.destroy({ id: { in: dataIdsToDelete } });
  
        return res.ok({ 
          message: 'Xóa dữ liệu thành công.', 
          deletedCount: dataIdsToDelete.length 
        });
  
      } catch (err) {
        console.log(err);
        return res.serverError({ error: 'Có lỗi xảy ra.', err });
      }
    }
  };
  