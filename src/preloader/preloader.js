const { Recipe, Diet, Dishtypes } = require("../db");
const { default: axios } = require("axios");
const { API_KEY } = process.env;

async function preLoader() {
  try {
    //Data que se tiene que precargar en primera instancia al existir ningun tipo de dietas
    const data = [
      { name: "gluten free" },
      { name: "ketogenic" },
      { name: "vegetarian" },
      { name: "lacto-vegetarian" },
      { name: "ovo-vegetarian" },
      { name: "vegan" },
      { name: "pescatarian" },
      { name: "paleo" },
      { name: "primal" },
      { name: "whole 30" },
    ];
    //Mapea el array data y procede con esos datos
    data.map(async (diet) => {
      const [newDiet, created] = await Diet.findOrCreate({
        where: { name: diet.name },
      });
    });

    //Guardo en una variable result la informacion traida desde  la api

    let result = await axios(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`
    );

    result.data.results.map(
      async ({
        analyzedInstructions,
        title,
        image,
        summary,
        spoonacularScore,
        healthScore,
        diets,
        dishTypes,
      }) => {
        try {
          //Explicar esto mostrando un ejemplo en: https://api.spoonacular.com/recipes/complexSearch?apiKey=396c8a5c1dbd4fe7b2d8f2a895a2c87f&addRecipeInformation=true&number=100
          let steps = [];
          if (analyzedInstructions.length !== 0) {
            analyzedInstructions[0].steps.map(async (step) => {
              steps.push(step.step);
            });
          }

          //Algunas recetas no tienen pasos

          const newRecipe = await Recipe.create({
            name: title,
            img: image,
            dish_resume: summary,
            score: spoonacularScore,
            healthy_level: healthScore,
            recipe: steps || null,
          });

          //Estos map se encargan de las otras 2 tablas relacionadas con la tabla principal recipe

          diets.map(async (diet) => {
            const [newDiet, created] = await Diet.findOrCreate({
              where: { name: diet },
            });
            await newRecipe.addDiet([newDiet]);
          });

          dishTypes.map(async (dishType) => {
            const [newDishType, created] = await Dishtypes.findOrCreate({
              where: { name: dishType },
            });
            await newRecipe.addDishtypes([newDishType]);
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = { preLoader };
