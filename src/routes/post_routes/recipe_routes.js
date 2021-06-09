const express = require("express");
const router = express.Router();
const { Recipe, Diet, Dishtypes } = require("../../db");
const { Op } = require("sequelize");

var multer = require("multer");

//detallo donde multer guardara las imagenes que se suban desde el post
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

//Asigno al post el middleware upload; Se utiliza tambien el middleware server.use("/uploads", express.static("uploads")); para exponer las fotos como archivos estaticos
router.post("/", upload.single("img"), async (req, res) => {
  const {
    name,
    dish_resume,
    score,
    healthy_level,
    recipe,
    dishtypes,
    diets,
  } = req.body;

  try {
    const newRecipe = await Recipe.create({
      name: name,
      img: `http://localhost:3001/${req.file.path}`,
      dish_resume: dish_resume,
      score: score,
      healthy_level: healthy_level,
      recipe: recipe,
    });

    diets?.map(async (diet) => {
      try {
        //Si no existe creo la dieta (El usuario no puede crear dietas, añado esto solo por las dudas de que por x razon no se encuentre la dieta en la db)
        const [newDiet, created] = await Diet.findOrCreate({
          where: { name: diet.toLowerCase() },
        });
        await newRecipe.addDiet([newDiet]);
      } catch (error) {
        console.log(error);
      }
    });

    dishtypes?.map(async (dishtype) => {
      try {
        const [newDishType, created] = await Dishtypes.findOrCreate({
          where: { name: dishtype.toLowerCase() },
        });
        await newRecipe.addDishtypes([newDishType]);
      } catch (error) {
        console.log(error);
      }
    });

    return res.send("created");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
