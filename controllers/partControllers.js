const express = require('express');
const { Part, Supplier } = require('../models');
const { Device } = require('../models');
const { Repair, RepairParts, RepairPartReturn } = require('../models');
const db = require('../models');
const Op = db.Sequelize.Op;

module.exports = {
  /** Create a part with provided parts, supplier, and device detail for currently signed in shop */
  create: async function (req, res) {
    try {
      const shopId = req.user.id;
      const newPart = await Part.create({ ...req.body, ShopId: shopId });
      res.status(201).json(newPart);
    } catch (error) {
      handleError(error, res);
    }
  },

  // get Part details
  find: async function (req, res) {
    try {
      const existingPart = await Part.findOne({
        where: { id: req.params.id, ShopId: req.user.id },
      });
      if (existingPart === null) {
        res.sendStatus(404);
      } else {
        const partStats = await calculateStatsById(req.params.id);
        res.json({ data: existingPart, stats: partStats });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  /** Returns all parts for current shop */
  findAll: async function (req, res) {
    try {
      const shopId = req.user.id;
      const existingParts = await Part.findAll({
        include: [{ model: Device }, { model: Supplier }],
        where: { ShopId: shopId },
      });
      if (existingParts === null) {
        res.json({ data: [] });
      } else {
        res.json({ data: existingParts });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  getAllBatches: async function (req, res) {
    try {
      const shopId = req.user.id;
      const partName = req.body.partName;
      const existingParts = await Part.findAll({
        include: [{ model: Device }],
        where: { ShopId: shopId, name: partName },
      });
      if (existingParts === null) {
        res.sendStatus({ date: [] });
      } else {
        const batchStats = await calculateStatsByName(partName);
        res.json({ data: existingParts, stats: batchStats });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  findByDevice: async function (req, res) {
    try {
      const shopId = req.user.id;
      const deviceId = req.params.id;
      const existingParts = await Part.findAll({
        include: [{ model: Device }, { model: Supplier }],
        where: { ShopId: shopId, DeviceId: deviceId },
      });
      if (existingParts === null) {
        res.json({ data: [] });
      } else {
        res.json({ data: existingParts });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  findPartNamesForDevice: async function (req, res) {
    try {
      const shopId = req.user.id;
      const deviceId = req.params.id;
      const existingParts = await Part.findAll({
        attributes: [
          [db.Sequelize.fn('DISTINCT', db.Sequelize.col('name')), 'partname'],
          'DeviceId',
          'supplierName',
        ],
        where: { ShopId: shopId, DeviceId: deviceId },
      });
      if (existingParts === null) {
        res.json({ data: [] });
      } else {
        res.json({ data: existingParts });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  getStatsById: async function (req, res) {
    try {
      // first lets get the total installs for this part
      const {
        totalInstalls,
        totalFailuresInLastYear,
        percentFailureLastYear,
      } = await calculateStatsById(req.params.id);
      res.json({
        data: {
          totalInstalls: totalInstalls,
          failures: totalFailuresInLastYear,
          percentFailure: percentFailureLastYear,
        },
      });
    } catch (error) {
      handleError(error, res);
    }
  },
  getStats: async function (req, res) {
    try {
      // first lets get the total installs for this part
      // lets get all the Ids for a given part name
      const {
        totalInstalls,
        totalFailuresInLastYear,
        percentFailureLastYear,
      } = await calculateStatsByName(req.body.partName);
      res.json({
        data: {
          totalInstalls: totalInstalls,
          failures: totalFailuresInLastYear,
          percentFailure: percentFailureLastYear,
        },
      });
    } catch (error) {
      handleError(error, res);
    }
  },
};

async function calculateStatsById(partId) {
  const totalInstalls = await RepairParts.sum('quantity', {
    where: { PartId: partId },
  });
  let dateRange = new Date().getTime() - 31556952000;
  const totalInstallsWithInYear = await RepairParts.sum('quantity', {
    where: { PartId: partId, createdAt: { [Op.gt]: dateRange } },
  });

  const totalFailuresInLastYear = await RepairPartReturn.sum(
    'RepairPartReturn.quantity',
    {
      include: [{ model: RepairParts, where: { PartId: partId } }],
      where: { comeBackDate: { [Op.gt]: dateRange } },
    }
  );
  const percentFailureLastYear =
    totalInstallsWithInYear == 0
      ? 0
      : (totalFailuresInLastYear / totalInstallsWithInYear) * 100;
  return { totalInstalls, totalFailuresInLastYear, percentFailureLastYear };
}

async function calculateStatsByName(partName) {
  const partIds = await Part.findAll({
    attributes: ['id'],
    where: { name: partName },
  }).map((pid) => pid.id);
  const totalInstalls = await RepairParts.sum('quantity', {
    where: { PartId: { [Op.in]: partIds } },
  });
  let dateRange = new Date().getTime() - 31556952000;
  const totalInstallsWithInYear = await RepairParts.sum('quantity', {
    where: {
      PartId: { [Op.in]: partIds },
      createdAt: { [Op.gt]: dateRange },
    },
  });

  const totalFailuresInLastYear = await RepairPartReturn.sum(
    'RepairPartReturn.quantity',
    {
      include: [
        { model: RepairParts, where: { PartId: { [Op.in]: partIds } } },
      ],
      where: { comeBackDate: { [Op.gt]: dateRange } },
    }
  );
  const percentFailureLastYear =
    totalInstallsWithInYear == 0
      ? 0
      : (totalFailuresInLastYear / totalInstallsWithInYear) * 100;
  return { totalInstalls, totalFailuresInLastYear, percentFailureLastYear };
}

function handleError(error, res) {
  console.log(error);
  res.status(500).json({ message: error });
}
