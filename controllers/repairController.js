const express = require('express');

const {
  Repair,
  Customer,
  RepairParts,
  Part,
  Device,
  Warranty,
  RepairPartReturn,
} = require('../models');
const warranties = require('./warrantyController');
const sendEmail = require('../utils/emailUtil');

module.exports = {
  create: async function (req, res) {
    try {
      const newRepair = await Repair.create({
        ...req.body,
        repairShopId: req.user.id,
      });
      await newRepair.reload({
        include: [{ model: Device }, { model: Customer }, { model: Part }],
      });
      await sendRepairStartedUpdate(newRepair, req.user);
      res.status(201).json(newRepair);
    } catch (error) {
      handleError(error, res);
    }
  },

  find: async function (req, res) {
    try {
      const shopId = req.user.id;
      const repairId = req.params.id;
      const existingRepair = await Repair.findOne({
        where: { id: repairId, repairShopId: shopId },
        include: [
          { model: Customer },
          { model: Part },
          { model: Device },
          { model: Warranty },
        ],
      });
      if (existingRepair === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: existingRepair });
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  findByCustomer: async function (req, res) {
    try {
      const shopId = req.user.id;
      const customerId = req.params.id;
      const customerRepairs = await Repair.findOne({
        where: { repairShopId: shopId, repairCustomerId: customerId },
        include: [{ model: Customer }, { model: Part }, { model: Device }],
      });
      if (customerRepairs === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: customerRepairs });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  findByShop: async function (req, res) {
    try {
      const shopId = req.user.id;
      const customerRepairs = await Repair.findAll({
        where: { repairShopId: shopId },
        include: [{ model: Customer }, { model: Part }, { model: Device }],
      });
      if (customerRepairs === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: customerRepairs });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  findByCustomer: async function (req, res) {
    try {
      const shopId = req.user.id;
      const customerId = req.params.customerId;
      const customerRepairs = await Repair.findAll({
        where: { repairShopId: shopId, repairCustomerId: customerId },
        include: [{ model: Customer }, { model: Part }, { model: Device }],
      });
      if (customerRepairs === null) {
        res.json({ data: [] });
      } else {
        res.json({ data: customerRepairs });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  update: async function (req, res) {
    try {
      const shopId = req.user.id;
      const repairId = req.params.id;
      const customerRepairs = await Repair.update({
        ...req.body, // update data
        where: { repairShopId: shopId, repairCustomerId: repairId },
        include: [{ model: Customer }, { model: Part }, { model: Device }],
      });
      if (customerRepairs === null) {
        res.sendStatus(404);
      } else {
        res.json({ data: customerRepairs });
      }
    } catch (error) {
      handleError(error, res);
    }
  },
  updateCost: async function (req, res) {
    try {
      const shopId = req.user.id;
      const updatedLaborCost = req.body.laborCost;
      const customerRepair = req.params.repair;
      customerRepair.laborCost = parseFloat(req.body.laborCost);
      customerRepair.totalPrice = parseFloat(customerRepair.totalPrice);
      const difference = customerRepair.laborCost - customerRepair.totalPrice;
      customerRepair.totalPrice = customerRepair.totalPrice + difference;
      await customerRepair.save({ fields: ['laborCost', 'totalPrice'] });
      await customerRepair.reload();
      res.json({ data: customerRepair });
    } catch (error) {
      handleError(error, res);
    }
  },
  updateNotes: async function (req, res) {
    try {
      const shopId = req.user.id;
      const customerRepair = req.params.repair;
      customerRepair.description = req.body.description;
      await customerRepair.save({ fields: ['description'] });
      await customerRepair.reload();
      res.json({ data: customerRepair });
    } catch (error) {
      handleError(error, res);
    }
  },
  updateStatus: async function (req, res) {
    try {
      const shopId = req.user.id;
      const customerRepair = req.params.repair;
      customerRepair.status = req.body.status;
      await customerRepair.save({ fields: ['status'] });
      await customerRepair.reload({
        include: [{ model: Device }, { model: Customer }, { model: Part }],
      });
      if (customerRepair.status === 'complete') {
        await sendRepairCompletionUpdate(customerRepair, req.user);
      }
      res.json({ data: customerRepair });
    } catch (error) {
      handleError(error, res);
    }
  },
  addPart: async function (req, res) {
    try {
      const shopId = req.user.id;
      const { repairId, partId, quantity = 1 } = req.params;
      // Check if the part is already to the repair
      const repairPart = await RepairParts.findOne({
        where: { RepairId: repairId, PartId: partId },
      });
      if (repairPart) {
        // if it already exists, just increase the quantity
        await incrementPartQuantityForRepair(repairPart, req, res);
        res.status(200).json(repairPart);
        return;
      }
      const addedPart = await RepairParts.create({
        RepairId: repairId,
        PartId: partId,
        ShopId: shopId,
        quantity: quantity,
      });
      // Gotta update the total cost of the repair
      await incrementRepairCostForAddedPart(partId, req.params.repair);
      res.status(201).json(addedPart);
    } catch (error) {
      handleError(error, res);
    }
  },
  removePart: async function (req, res) {
    try {
      const shopId = req.user.id;
      const { repairId, partId } = req.params;
      const repairPart = await RepairParts.findOne({
        where: { RepairId: repairId, PartId: partId },
      });
      const repair = req.params.repair;
      if (repairPart === null) {
        res.sendStatus(200); // Part has already been deleted so we just send 200.
      } else if (repair.dataValues.repairShopId !== shopId) {
        res.sendStatus(401);
      } else {
        // Gotta update the total cost of the repair
        const partToBeRemoved = await Part.findByPk(partId, {
          attributes: ['price'],
        });
        // gotta add this to totalprice of the repair
        await repair.decrement(['totalPrice'], {
          by: partToBeRemoved.dataValues.price,
        });
        await repairPart.destroy();
        res.sendStatus(200);
      }
    } catch (error) {
      handleError(error, res);
    }
  },

  claimWarranty: async function (req, res) {
    try {
      const repairId = req.params.repairId;
      // certain parts will be replaced. So get the parts id and mark them as replaced
      // and record today's date as comeback date/
      // But first check a valid warranty exist for this repair and that the
      const repair = req.params.repair;
      const isValidWarranty = await warranties.isWarrantyValid(
        req.params.repairId
      );
      if (repair.status === 'delivered' && isValidWarranty) {
        const { partsToBeReplaced, quantity = 1 } = req.body;
        const repairParts = await RepairParts.findAll({
          include: [{ model: RepairPartReturn }],
          where: { PartId: [...partsToBeReplaced], RepairId: repairId },
        });
        repairParts.forEach(async (repairPart) => {
          repairPart.replaced = true;
          await repairPart.save();
          await RepairPartReturn.create({
            RepairPartId: repairPart.dataValues.repairPartId,
            comeBackDate: new Date().getTime(),
            quantity: quantity,
          });
        });
        res.sendStatus(200);
      } else {
        res.statusMessage =
          'Repair job must be in delivered state before the Warranty can be claimed.';
        res.sendStatus(400);
      }
    } catch (error) {
      handleError(error, res);
    }
  },
};

async function sendRepairCompletionUpdate(customerRepair, shop) {
  sendEmail({
    to: customerRepair.Customer.email,
    subject: `Your device ${customerRepair.Device.model} is ready for pickup`,
    body: getRepairCompletedBody(customerRepair, shop),
  });
}

async function sendRepairStartedUpdate(customerRepair, shop) {
  sendEmail({
    to: customerRepair.Customer.email,
    subject: `Repiar for your device ${customerRepair.Device.model} is in progress`,
    body: getRepairStartedBody(customerRepair, shop),
  });
}

async function incrementPartQuantityForRepair(repairPart, req, res) {
  const { repairId, partId, quantity = 1 } = req.params;
  await repairPart.increment(['quantity'], {
    by: quantity,
  });
  await incrementRepairCostForAddedPart(partId, req.params.repair);
  await repairPart.reload();
  return repairPart;
}

async function incrementRepairCostForAddedPart(partId, repair) {
  const partPrice = await Part.findByPk(partId, { attributes: ['price'] });
  // gotta add this to totalprice of the repair
  await repair.increment(['totalPrice'], {
    by: partPrice.dataValues.price,
  });
}

function getRepairCompletedBody(customerRepair, shop) {
  // const partsInfo =
  //   customerRepair.Parts.length > 0
  //     ? `<p>Following parts were added/replaced in your device</p>
  //         ${getPartDetailsForEmail(customerRepair.Parts)}`
  //     : '';
  return `<html>
        <p>Dear ${customerRepair.Customer.name},</p>
        <p>Your device  <b>${customerRepair.Device.model}</b> is ready for pickup at <b>${shop.name}</b></p>              
        <p>Team REPARRiT</p>
        </html>`;
}

function getRepairStartedBody(customerRepair, shop) {
  return `<html>
        <p>Dear ${customerRepair.Customer.name},</p>
        <p><b>${shop.name}</b> has started working on reparing your device <b>${customerRepair.Device.model}</b>.</p> 
        <p>We will inform you when it's ready for pick up.</p>              
        <p>Team REPARRiT</p>
        </html>`;
}

function getPartDetailsForEmail(parts) {
  let partDetail = '<p><b>PartName&nbsp;$nbsp;Price</b></p>';
  parts.forEach(
    (part) =>
      (partDetail = partDetail.concat(
        `${part.name}&nbsp;$nbsp;${part.price}</br>`
      ))
  );
  return partDetail;
}

function handleError(error, res) {
  // console.log(error);
  const { name } = error;
  res.status(500).json({ message: name ? name : error });
}
