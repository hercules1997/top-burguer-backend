import * as Yup from "yup"
import Category from "../models/Category"
import Product from "../models/Product"
import User from "../models/User"
import database from "../../database"
import { Sequelize } from "sequelize"

const sequelize = database.connection
class ProductController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        price: Yup.number().required(),
        category_id: Yup.number().required(),
        offer: Yup.boolean(),
      })

      try {
        await schema.validateSync(request.body, {
          abortEarly: false,
        })
      } catch (err) {
        return response.status(400).json({
          error: err.errors,
        })
      }

      const { admin: isAdmin } = await User.findByPk(request.userId)

      if (!isAdmin) {
        return response.status(401).json({
          message: "Não autorizado",
        })
      }

      const { filename: path } = request.file
      const { name, price, category_id, offer } = request.body

      const product = await Product.create({
        name,
        price: price,
        category_id,
        path,
        offer,
      })

      return response.json(product)
    } catch (err) {
      console.log(err)
    }
  }

  async index(request, response) {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })

    return response.json(products)
  }



  async delete(request, response) {
    try {
      const Item = sequelize.define("products", {
        name: Sequelize.STRING,
        price: Sequelize.REAL,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/product-file/${this.path}`
          },
        },
      })

      const { id } = request.params
      const contactId = await Product.findByPk(id)
      console.log(contactId)


       Item.destroy({ where: { id: contactId.dataValues.id } })
      return response
        .status(200)
        .json({ message: "Contato deletado com sucesso!" })
    } catch (error) {
      console.log(err)
    }
  }





  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        price: Yup.number(),
        category_id: Yup.number(),
        offer: Yup.boolean(),
      })

      try {
        await schema.validateSync(request.body, {
          abortEarly: false,
        })
      } catch (err) {
        return response.status(400).json({
          error: err.errors,
        })
      }
      const { admin: isAdmin } = await User.findByPk(request.userId)

      if (!isAdmin) {
        return response.status(401).json({
          message: "Não autorizado",
        })
      }

      const { id } = request.params

      const product = await Product.findByPk(id)

      if (!product) {
        return response.status(401).json({
          message: "Produto não existe",
        })
      }

      let path
      if (request.file) {
        path = request.file.filename
      }

      const { name, price, category_id, offer } = request.body

      await Product.update(
        {
          name,
          price,
          category_id,
          path,
          offer,
        },
        {
          where: {
            id,
          },
        }
      )

      return response.status(200).json({
        message: "Alterado com sucesso!",
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export default new ProductController()
