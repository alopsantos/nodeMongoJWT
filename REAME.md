# Node Mongo JWT

## Projeto proposto na mentoria Hiring Coders 3
Professora: 👩🏽‍💻 [Marianne Salomão](https://github.com/mariannesalomao)<br />
Youtube: 📢 [Mentoria 10/06](https://www.youtube.com/watch?v=4ZrMgWN55K0)


## Script

```
yarn add bcrypt dotenv express jsonwebtoken mongoose
yarn add -D nodemon

mkdir src
touch ./src/app.js
mkdir ./src/models
touch ./src/models/User.js

```

### Package.json
<br />

```
"scripts": {
  "start": "nodemon ./src/app.js"
}
```

- [X] Bcrypt pega a senha que vc digita cru ali e transforma num hash.
- [X] Dotenv pra gente ter um arquivo de configuração na máquina, a ideia é não versionar esse arquivo.
- [X] Jsonweb token é pra manusear o token, verificar se o token do usuário é válido.

### Criar os arquivos
<br />

```
  touch .gitignore
  touch .env
  touch exemplo.http
```

## Rotas

- [GET]  http://localhost:3000/

- [POST] http://localhost:3000/auth/register
```
  {
    "name": "Anderson Lopes",
    "email": "anderson@anderson.com",
    "password":"sua senha",
    "confirmPassword": "sua senha"
  }
```

- [POST] http://localhost:3000/auth/login
```
  {
    "email": "anderson@anderson.com",
    "password": "sua senha"
  }
```

- [GET]  http://localhost:3000/user/:{seu_ID}
```
  Content-Type: application/json
  Authorization: Bearer {Token}
```