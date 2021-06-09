const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const getTypes = require("./get_routes/type_routes");

const getRecipes = require("./get_routes/recipe_routes");

const postRecipes = require("./post_routes/recipe_routes");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/type", getTypes);

router.use("/recipes", getRecipes);

router.use("/recipe", postRecipes);

module.exports = router;
