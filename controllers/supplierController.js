const express = require('express');
const { Supplier } = require('../models');
const { Shop } = require('../models');
const { ShopSuppliers } = require('../models');

module.exports = {
  create: async function (req, res) {
    try {
      const newSupplier = await Supplier.create(req.body);
      // pick out the shop-id from the session and then create the shop suppliers relationship
      await ShopSuppliers.create({
        SupplierId: newSupplier.id,
        ShopId: req.body.UserId,
      });
      res.status(201).json(newSupplier);
    } catch (error) {
      handleError(error, res);
    }
  },

  // get shop details
  find: async function (req, res) {
    try {
      const existingDevice = await Device.findByPk(req.params.id);
      if (existingDevice === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: existingDevice });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  findAll: async function (req, res) {
    try {
      const existingDevices = await Device.findAll();
      if (existingDevices === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: existingDevices });
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
