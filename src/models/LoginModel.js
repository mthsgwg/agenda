const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email })

    if (!this.user) {
      this.errors.push('Usuário ou senha inexistentes.');
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida.');
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    this.userExists();

    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email })
    if (this.user) this.errors.push('Usuário já existe.');
  }

  valida() {
    this.cleanUp();
    //validação
    //email precisa ser valido
    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');

    //a senha precisa ter entre 4 e 26 caracteres
    if (this.body.password.length < 4 || this.body.password.length > 26) this.errors.push('Senha deve ter entre 4 e 26 caracteres.');

  }

  cleanUp() {

    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }

      this.body = {
        email: this.body.email,
        password: this.body.password,
      };
    };
  };
}

module.exports = Login;
