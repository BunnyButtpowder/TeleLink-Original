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
      // Lấy các bản ghi blacklist tương ứng với id đã cho
      const blacklistedItems = await Blacklist.find({ id: { in: ids } });

      if (blacklistedItems.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy bản ghi nào trong Blacklist với ID đã cho' });
      }

  
      const sdtList = blacklistedItems.map(item => item.SDT);

    
      const dataItems = await Data.find({
        subscriberNumber: { in: sdtList }
      });


      if (dataItems.length > 0) {
        await Data.update({
          id: { in: dataItems.map(item => item.id) }
        })
        .set({
          isBlock: false,
        });
      }

      await Blacklist.destroy({ id: { in: ids } });

      return res.json({ message: 'Đã xóa tất cả các bản ghi trong Blacklist thành công và cập nhật Data' });
    } catch (err) {
      return res.status(500).json({ error: 'Có lỗi xảy ra khi xóa các bản ghi trong Blacklist', details: err.message });
    }
  },
};
