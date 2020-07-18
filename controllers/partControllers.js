const express = require('express');
const { Part, Supplier } = require('../models');
const { Device } = require('../models');
const { Repair } = require('../models');

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
        res.json({ data: existingPart });
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
        res.sendStatus(404);
      } else {
        res.json({ data: existingParts });
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
        res.sendStatus(404);
      } else {
        res.json({ data: existingParts });
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
