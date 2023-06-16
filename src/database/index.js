import Sequelize from "sequelize"
import mongoose from "mongoose"

import Product from "../app/models/Product"
import User from "../app/models/User"
import Category from "../app/models/Category"

import configDatabase from "../config/database"

const models = [User, Product, Category]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(configDatabase.baseURL)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }

  mongo() {
    mongoose.set("strictQuery", false)
    this.mongoConnection = mongoose.connect(
      "mongodb://mongo:ARzStNEuPoAMZuWz0PrU@containers-us-west-97.railway.app:5731",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
  }
}

export default new Database()
