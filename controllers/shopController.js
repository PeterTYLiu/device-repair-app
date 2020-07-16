const express = require('express');
const db = require('../models');

module.exports = Shop = {
  // Shop owner would need to be able to register their shop. i.e. Create a new shop.
  create: async function (req, res) {
    try {
      const newShop = await db.Shop.create(req.body);
      res.status(201).json(newShop);
    } catch (error) {
      handleError(error, res);
    }
  },

  // get shop details
  findShop: async function (req, res) {
    try {
      const existingShop = await db.Shop.findByPk(req.params.id, {
        include: [{ model: db.Repair, as: 'repairs', reuired: false }],
      });
      if (existingShop === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: existingShop });
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
