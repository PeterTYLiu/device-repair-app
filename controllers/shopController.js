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
      const shopId = req.user.id;
      const existingShop = await db.Shop.findByPk(shopId, {
        include: [{ model: db.Repair, as: 'repairs' }],
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

  addCustomer: async function (req, res) {
    try {
      const customerId = req.params.customerId;
      const shopId = req.user.id;
      const existingCustomer = await db.ShopCustomers.findOne({
        where: { CustomerId: customerId, ShopId: shopId },
      });
      if (existingCustomer) {
        res.status(200).json(existingCustomer);
      } else {
        const newCustomerForShop = await db.ShopCustomers.create({
          CustomerId: customerId,
          ShopId: shopId,
        });
        res.status(200).json(newCustomerForShop);
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  findAllCustomers: async function (req, res) {
    try {
      const existingCustomers = await db.Customer.findAll();
      if (existingCustomers === null) {
        res.json({ data: [] });
      } else {
        res.json({ data: existingCustomers });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  findAllCustomersByShop: async function (req, res) {
    try {
      const shopId = req.user.id;
      const existingCustomersForShop = await db.Customer.findAll({
        attributes: ['id', 'email', 'name'],
        include: [
          { model: db.Shop, where: { id: shopId }, attributes: ['id', 'name'] },
        ],
      });
      if (existingCustomersForShop === null) {
        res.json({ data: [] });
      } else {
        res.json({ data: existingCustomersForShop });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
};

function handleError(error, res) {
  const { name } = error;
  res.status(500).json({ message: name ? name : error });
}
