const express = require("express");
const router = express.Router();
const { Recipe, Diet, Dishtypes } = require("../../db");
const { Op } = require("sequelize");

router.get("/", (req, res) => {
  const { name } = req.query;
  if (name?.length === 0) {
    Recipe.findAll({ include: { model: Diet, attributes: ["name"] } })
      .then((recipes) => {
        return res.json(recipes);
      })
      .catch((err) => console.log(err));
  } else {
    Recipe.findAll({
      limit: 9,
      include: { model: Diet, attributes: ["name"] },
      where: { name: { [Op.substring]: name } },
    })
      .then((recipes) => {
        if (recipes.length === 0) {
          return res.json({ error: "Recipe not found" });
        }
        return res.json(recipes);
      })
      .catch((err) => console.log(err));
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await Recipe.findByPk(id, {
    attributes: [
      "name",
      "score",
      "healthy_level",
      "dish_resume",
      "recipe",
      "img",
    ],
    include: [
      {
        model: Diet,
      },
      {
        model: Dishtypes,
      },
    ],
  });
  return res.json(result);
});

module.exports = router;
