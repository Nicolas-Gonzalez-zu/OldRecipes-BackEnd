/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Recipe, conn } = require("../../src/db.js");

const agent = session(app);
const recipe = {
  name: "Milanea a la napolitana",
  dish_resume: "Carne empanada con pan rallado",
};

const recipe2 = {
  name: "Papas fritas",
  dish_resume: " Papas fritadas en aceite",
};

describe("Recipe routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() =>
    Recipe.sync({ force: true }).then(() => {
      Recipe.create(recipe);
      Recipe.create(recipe2);
    })
  );
  describe("GET /recipes", () => {
    it("should get 200", () => agent.get("/recipes").expect(200));
    it("should get a json", () =>
      agent.get("/recipes").expect("Content-Type", /json/));
    it("should get all recipes", () =>
      agent
        .get("/recipes")
        .query({ name: "" })
        .then((res) => {
          expect(res.body).to.have.lengthOf.above(1);
        }));
    it("should get recipes with the query in their name", () =>
      agent
        .get("/recipes")
        .query({ name: "Papas fritas" })
        .then((res) => {
          expect(res.body).to.have.lengthOf(1);
        }));
    it("should get all recipes with an a in their names", () =>
      agent
        .get("/recipes")
        .query({ name: "a" })
        .then((res) => {
          expect(res.body).to.have.lengthOf.above(1);
        }));
  });
  describe("GET /recipes/:id", () => {
    it("should get 200", () => agent.get("/recipes/1").expect(200));
    it("should get one recipe in json", () =>
      agent.get("/recipes/1").expect("Content-Type", /json/));
    it("should get one recipe", () =>
      agent.get("/recipes/1").then((res) => {
        expect(res.body).to.not.be.an("array");
      }));
  });
});
