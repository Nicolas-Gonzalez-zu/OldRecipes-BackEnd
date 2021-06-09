var express = require("express");
var router = express.Router();

const { Diet, Dishtypes } = require("../../db");

router.get("/", async (req, res) => {
  try {
    const diets = await Diet.findAll();
    return res.json(diets);
  } catch (error) {
    console.log(error);
  }
});

router.get("/dish", async (req, res) => {
  try {
    const dish_types = await Dishtypes.findAll();
    return res.json(dish_types);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
