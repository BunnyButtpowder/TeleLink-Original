module.exports = {
    manyDelete: async function (req, res) {
      const { networkName, createdAt } = req.body;
  
      // Validate required input
      if (!networkName) {
        return res.status(400).json({
          message: 'Missing required parameter: networkName',
        });
      }
  
      try {
        // Build query filter
        const filter = { networkName };
  
        // Add date filter if `createdAt` is provided
        if (createdAt) {
          const startOfDay = new Date(`${createdAt}T00:00:00Z`).getTime();
          const endOfDay = new Date(`${createdAt}T23:59:59Z`).getTime();
          filter.createdAt = { '>=': startOfDay, '<=': endOfDay };
        }
  
        // Find matching records
        const recordsToDelete = await Data.find(filter);
        if (!recordsToDelete || recordsToDelete.length === 0) {
          return res.status(404).json({ message: 'No records found to delete' });
        }
  
        // Extract IDs and delete
        const idsToDelete = recordsToDelete.map((item) => item.id);
        await Data.destroy({ id: { in: idsToDelete } });
  
        return res.json({
          message: `Successfully deleted ${recordsToDelete.length} records`,
          deletedIds: idsToDelete,
        });
      } catch (error) {
        return res.status(500).json({
          message: 'An error occurred while deleting records',
          details: error.message,
        });
      }
    },
  };
  