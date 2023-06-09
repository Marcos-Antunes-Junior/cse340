// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classValidate = require("../utilities/inventoryValidation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by id
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to Management View
router.get("/management", utilities.handleErrors(invController.buildManagementView));

// Route to Add Classification View
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));

// Route to Add Inventory View
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory));

// Process the add Classification data
router.post('/addClassification', classValidate.classificationRules(),
classValidate.checkClassData,
utilities.handleErrors(invController.addClassification));

// Process the add Inventory data
router.post('/addInventory', classValidate.inventoryRules(),
classValidate.checkInvData,
utilities.handleErrors(invController.addInventory));

module.exports = router;