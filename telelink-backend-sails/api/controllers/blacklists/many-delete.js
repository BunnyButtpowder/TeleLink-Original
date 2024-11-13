module.exports = {
    inputs: {
      ids: {
        type: 'ref', 
        required: true,
      },
    },
  
    fn: async function (inputs) {
      let { ids } = inputs;
      let { res } = this;
  
      try {

        const blacklistedItems = await Blacklist.find({ id: { in: ids } });
  
        if (blacklistedItems.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy bản ghi nào trong Blacklist với ID đã cho' });
        }

        await Blacklist.destroy({ id: { in: ids } });
  
        return res.json({ message: 'Đã xóa tất cả các bản ghi trong Blacklist thành công' });
      } catch (err) {
        return res.status(500).json({ error: 'Có lỗi xảy ra khi xóa các bản ghi trong Blacklist', details: err.message });
      }
    },
  };
  
  