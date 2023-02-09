import * as Yup from "yup"
import User from "../models/User"

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const useEmailOrPasswordIncorret = () => {
      return response
        .status(401)
        .json({ error: "Usuario e senha não estão corretos" })
    }

    if (!(await schema.isValid(request.body))) useEmailOrPasswordIncorret()

    const { email, password } = request.body

    const user = await User.findOne({ where: { email } })

    if (!user) useEmailOrPasswordIncorret()

    if (!(await user.checkPassword(password))) useEmailOrPasswordIncorret()

    return response
      .status(200)
      .json({ id: user.id, email, name: user.name, admin: user.admin })
  }
}

export default new SessionController()
