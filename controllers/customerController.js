const express = require('express');
const { Customer } = require('../models');
const { Repair } = require('../models');

module.exports = {
  // Shop owner would need to be able to register their shop. i.e. Create a new shop.
  create: async function (req, res) {
    try {
      const newCustomer = await Customer.create(req.body);
      res.status(201).json(newCustomer);
    } catch (error) {
      handleError(error, res);
    }
  },

  // get shop details
  find: async function (req, res) {
    try {
      const existingCustomer = await Customer.findByPk(req.user.id, {
        include: [{ model: Repair, as: 'repairs', reuired: false }],
      });
      if (existingCustomer === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: existingCustomer });
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
