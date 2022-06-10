require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");

const app = express();

// Model
app.use(express.json());

// Conexão com banco MongoDB
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@testecluster.xh3nc.mongodb.net/7retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conectou ao banco");
    app.listen({ port: 3000 });
  })
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo a api!" });
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatorio" });
  }

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatorio" });
  }

  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatorio" });
  }

  if (password !== confirmPassword) {
    return res
      .status(422)
      .json({ msg: "O password e senha precisam ser iguais" });
  }

  // check se o usuario ja existe

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(422).json({ msg: "Email ja cadastrado" });
  }
  // criar senha criptografada
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Criar usuario
  const user = new User({
    name,
    email,
    password: passwordHash,
  });
  
  try {
    await user.save();
    res.status(201).json({ msg: "Usuario cadastrado com sucesso" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // validação

  if (!email) {
    return res.status(422).json({ msg: "Informe um email valido, email é obrigatorio" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Senha é um campo obrigatorio" });
  }

  // check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  // check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await User.findById(id, "-password");
  // RETORNO

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
});

app.get("/users", checkToken, async (req, res) => {
  const users = await User.find()

  res.status(200).json({users})
})

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}
