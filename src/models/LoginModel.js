const mongoose = require("mongoose");
const validator = require("validator");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  senha: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  register() {
    this.valida();
    if (this.errors.length > 0) return;
  }

  valida() {
    this.cleanUp();
    //validação
    //email precisa ser valido
    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');

    //a senha precisa ter entre 4 e 26 caracteres
    if (this.body.password.lenght < 4 || this.body.password.lenght > 26) this.erros.push('Senha deve ter entre 4 e 26 caracteres.');

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
