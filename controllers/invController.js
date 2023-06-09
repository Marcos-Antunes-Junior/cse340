const invModel = require("../models/inventoryModel")
const utilities = require("../utilities/")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory by id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    const detailView = await utilities.buildInventoryDetailView(data)
    let nav = await utilities.getNav()
    const invYear = data[0].inv_year
    const invMake = data[0].inv_make
    const model = data[0].inv_model
    res.render("./inventory/detail", {
        title: invYear + " " + invMake + " " + model,
        nav,
        detailView,
    })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Build Add Classification view
 * ************************** */

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
    errors: null,
    })

}

invCont.addClassification = async function (req, res){
    const { classification_name } = req.body
    const addResult = await invModel.registerAddClassification(classification_name)
    let nav = await utilities.getNav()

    if (addResult) {
        req.flash(
            "notice",
            `The ${classification_name} classification was succesfully added.`

        )
        res.status(201).render("inventory/management", {
           title: "Inventory Management",
           nav,       

        })
    } else {
        req.flash("notice", "Sorry, the operation failed.")
        res.status(501).render("inventory/addClassification", {
            title: "Add Classification",
            nav,  
        })
    }
}


/* ***************************
 *  Build Add Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let options = await utilities.buildOptions()
    let nav = await utilities.getNav()
    res.render("./inventory/addInventory", {
        title: "Add Inventory",
        nav,
        options,
        errors: null,
        }) 
}

invCont.addInventory = async function (req, res) {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    const addResult = await invModel.registerAddinventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    let nav = await utilities.getNav()
    if (addResult) {
        req.flash(
            "notice",
            `The ${inv_model} vehicle was succesfully added.`

        )
        res.status(201).render("inventory/management", {
           title: "Inventory Management",
           nav,       

        })
    } else {
        req.flash("notice", "Sorry, the operation failed.")
        res.status(501).render("inventory/addInventory", {
            title: "Add Inventory",
            nav,  
        })
    }
}

module.exports = invCont