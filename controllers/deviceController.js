const express = require('express');
const { Device } = require('../models');
const { Repair } = require('../models');

module.exports = {
  create: async function (req, res) {
    try {
      const newDevice = await Device.create(req.body);
      res.status(201).json(newDevice);
    } catch (error) {
      handleError(error, res);
    }
  },

  // get shop details
  find: async function (req, res) {
    try {
      const existingDevice = await Device.findByPk(req.user.id);
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
