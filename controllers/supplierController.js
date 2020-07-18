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
        ShopId: req.user.id,
      });
      res.status(201).json(newSupplier);
    } catch (error) {
      handleError(error, res);
    }
  },

  // get supplier details
  find: async function (req, res) {
    try {
      const existingSuppliers = await Supplier.findByPk(req.params.id);
      if (existingSuppliers === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: existingSuppliers });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  findAll: async function (req, res) {
    try {
      const existingSuppliers = await Supplier.findAll();
      if (existingSuppliers === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: existingSuppliers });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  findByShop: async function (req, res) {
    try {
      const shopId = req.user.id;
      const existingSuppliers = await ShopSuppliers.findAll({
        include: [{ model: Supplier }],
        where: { ShopId: shopId },
      });
      if (existingSuppliers === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: existingSuppliers });
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
