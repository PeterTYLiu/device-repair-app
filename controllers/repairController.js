const express = require('express');
const { Repair, Customer, RepairParts, Part, Device } = require('../models');

module.exports = {
  create: async function (req, res) {
    try {
      const newRepair = await Repair.create(req.body);
      res.status(201).json(newRepair);
    } catch (error) {
      handleError(error, res);
    }
  },

  find: async function (req, res) {
    try {
      const shopId = req.user.id;
      const repairId = req.params.id;
      const existingRepair = await Repair.findOne({
        where: { id: repairId, repairShopId: shopId },
        include: [{ model: Customer }, { model: Part }, { model: Device }],
      });
      if (existingRepair === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: existingRepair });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  findByCustomer: async function (req, res) {
    try {
      const shopId = req.user.id;
      const customerId = req.params.id;
      const customerRepairs = await Repair.findOne({
        where: { repairShopId: shopId, repairCustomerId: customerId },
        include: [{ model: Customer }, { model: Part }, { model: Device }],
      });
      if (customerRepairs === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: customerRepairs });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  findByShop: async function (req, res) {
    try {
      const shopId = req.user.id;
      const customerRepairs = await Repair.findAll({
        where: { repairShopId: shopId },
        include: [{ model: Customer }, { model: Part }, { model: Device }],
      });
      if (customerRepairs === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: customerRepairs });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  update: async function (req, res) {
    try {
      const shopId = req.user.id;
      const repairId = req.params.id;
      const customerRepairs = await Repair.update({
        ...req.body, // update data
        where: { repairShopId: shopId, repairCustomerId: repairId },
        include: [{ model: Customer }, { model: Part }, { model: Device }],
      });
      if (customerRepairs === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: customerRepairs });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  updateCost: async function (req, res) {
    try {
      const shopId = req.user.id;
      const updatedLaborCost = req.body.laborCost;
      const customerRepair = await Repair.findByPk(req.params.repairId);
      if (customerRepair === null) {
        res.sendStatus(404);
      } else {
        customerRepair.laborCost = req.body.laborCost;
        customerRepair.totalPrice += req.body.laborCost;
        await customerRepair.save({ fields: ['laborCost', 'totalPrice'] });
        await customerRepair.reload();
        res.json({ data: customerRepair });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  updateNotes: async function (req, res) {
    try {
      const shopId = req.user.id;
      const customerRepair = await Repair.findByPk(req.params.repairId);
      if (customerRepair === null) {
        res.sendStatus(404);
      } else {
        customerRepair.description = req.body.description;
        await customerRepair.save({ fields: ['description'] });
        await customerRepair.reload();
        res.json({ data: customerRepair });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  addPart: async function (req, res) {
    try {
      const shopId = req.user.id;
      const { repairId, partId } = req.params;
      const addedPart = await RepairParts.create({
        RepairId: repairId,
        PartId: partId,
        ShopId: shopId,
      });
      // Gotta update the total cost of the repair
      const partPrice = await Part.findByPk(partId, { attributes: ['price'] });
      // gotta add this to totalprice of the repair
      const repair = await Repair.findByPk(repairId);
      await repair.increment(['totalPrice'], {
        by: partPrice.dataValues.price,
      });
      res.status(201).json(addedPart);
    } catch (error) {
      handleError(error, res);
    }
  },
  removePart: async function (req, res) {
    try {
      const shopId = req.user.id;
      const { repairId, partId } = req.params;
      const repairPart = await RepairParts.findOne({
        where: { RepairId: repairId, PartId: partId },
      });
      const repair = await Repair.findByPk(repairId);
      if (repairPart === null) {
        res.sendStatus(200); // Part has already been deleted so we just send 200.
      } else if (repair.dataValues.repairShopId !== shopId) {
        res.sendStatus(401);
      } else {
        // Gotta update the total cost of the repair
        const partToBeRemoved = await Part.findByPk(partId, {
          attributes: ['price'],
        });
        // gotta add this to totalprice of the repair
        await repair.decrement(['totalPrice'], {
          by: partToBeRemoved.dataValues.price,
        });
        await repairPart.destroy();
        res.sendStatus(200);
      }
    } catch (error) {
      handleError(error, res);
    }
  },
};

function handleError(error, res) {
  console.log(error);
  res.status(500).json({ message: error });
}
