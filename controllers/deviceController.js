const express = require('express');
const { Device, Repair, Manufacturer } = require('../models');

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
      const existingDevice = await Device.findByPk(req.params.deviceId, {
        include: [{ model: Manufacturer }],
      });
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
      const existingDevices = await Device.findAll({
        include: [{ model: Manufacturer }],
      });
      if (existingDevices === null) {
        res.json({ data: [] });
      } else {
        res.json({ data: existingDevices });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  findAllManufacturers: async function (req, res) {
    try {
      const allManufacturers = await Manufacturer.findAll();
      if (allManufacturers === null) {
        res.json({ data: [] });
      } else {
        res.json({ data: allManufacturers });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  createManufacturer: async function (req, res) {
    try {
      const newManufacturer = await Manufacturer.create(req.body);
      res.status(201).json(newManufacturer);
    } catch (error) {
      handleError(error, res);
    }
  },
};

function handleError(error, res) {
  console.log(error);
  res.status(500).json({ message: error });
}
