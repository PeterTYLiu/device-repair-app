const express = require('express');
const { Warranty } = require('../models');
const { Repair } = require('../models');
const repair = require('../models/repair');

module.exports = {
  create: async function (req, res) {
    try {
      // Check if warranty already exists for this repair
      const repairId = req.params.repairId;
      const existingWarranty = await Warranty.findOne({
        where: { RepairId: repairId },
      });
      if (existingWarranty !== null) {
        // warranty already exists
        res.statusMessage = 'A Warranty Already Exists';
        res.sendStatus(409);
      } else if (req.params.repair.status !== 'complete') {
        res.statusMessage =
          'The repair must be completed before a warranty can be created';
        res.sendStatus(400);
      } else {
        const newWarranty = await Warranty.create({
          ...req.body,
          RepairId: repairId,
          warrantyShopId: req.user.id,
        });

        res.status(201).json(newWarranty);
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  // get supplier details
  find: async function (req, res) {
    try {
      const existingWarranty = await Warranty.findByPk(req.params.id);
      if (existingWarranty === null) {
        res.sendStatus(404);
      } else {
        // We need to check if the warranty coverage has passed, if so then we need to mark warranty as expired.
        await updateWarrantyStatus(existingWarranty);
        res.json({ data: existingWarranty });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  /** Returns all warranties for currently signed in shop */
  findAll: async function (req, res) {
    try {
      const existingWarranties = await Warranty.findAll({
        where: { warrantyShopId: req.user.id },
      });
      if (existingWarranties === null) {
        // send an empty array. The shop may not have had given out any warranties
        res.json({ data: [{}] });
      } else {
        existingWarranties.forEach(
          async (warranty) => await updateWarrantyStatus(warranty)
        );
        res.json({ data: existingWarranties });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  isWarrantyValid: async function (repairId) {
    const existingWarranty = await Warranty.findOne({
      where: { RepairId: repairId },
    });
    if (existingWarranty) {
      return existingWarranty.status === 'Valid';
    }
    return false;
  },
};

async function updateWarrantyStatus(existingWarranty) {
  if (existingWarranty.endDate < new Date().getTime()) {
    // Mark the status as expired
    existingWarranty.status = 'Expired';
    await existingWarranty.save();
  }
}

function handleError(error, res) {
  console.log(error);
  res.status(500).json({ message: error });
}
