const express = require('express');
const { Customer } = require('../models');
const { Repair } = require('../models');
const sendEmail = require('../utils/emailUtil');

module.exports = {
  // Shop owner would need to be able to register their shop. i.e. Create a new shop.
  create: async function (req, res) {
    try {
      const newCustomer = await Customer.create(req.body);
      const shop = req.user;
      sendEmail({
        to: newCustomer.email,
        subject: 'Your new REPARRiT account',
        body: getNewCustomerEmailBody(newCustomer, shop),
      });
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

function getNewCustomerEmailBody(newCustomer, shop) {
  return `<html>
        <p>Dear ${newCustomer.name},</p><p>${shop.name} has made an account for you on <a href='http://localhost:3000/customerlogin'>REPARRiT</a>.</p> 
        Please use you email address to login to your account. Your password is \n <b> ${newCustomer.cleanPass}</b>
        <p>You may change your password later.</p>
        <p>Team REPARRiT</p>
        </html>`;
}

function handleError(error, res) {
  console.log(error);
  res.status(500).json({ message: error });
}
