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

module.exports = invCont