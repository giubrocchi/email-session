const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: "3748t7823yghin3e45g93",
  secure: false,
  resave: false,
  saveUninitialized: false
}));

let users = [];

app.get('/', function(req, res) {
  if (req.session.user) {
    res.sendFile(__dirname + '/public/email.html');
  }
  else {
    res.sendFile(__dirname + '/public/cadastrar.html');
  }
});

app.get('/getLogin', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/verificaCad', function(req, res){
  // 0 NÃO HÁ USUÁRIO CADASTRADO, 1 JÁ HÁ USUÁRIO
  let user = req.body.user;
  if(users.filter((v) => (v.user === user)).length > 0){
    res.send("1");
  }
  else{
    res.send("0");
  }
});

app.post('/cadastrar', function(req, res){
  // 0 ERRO AO CADASTRAR, 1 SUCESSO
  let user = req.body.user;
  let senha = req.body.senha;
  if(users.filter((v) => (v.user === user)).length > 0){
    res.send("0");
  }
  else{
    users.push({"user": user, "senha": senha});
    req.session.user = user;
    req.session.senha = senha;
    res.send("1");
  }
});

app.get('/verificaLogin', function(req, res){
  // 0 NÃO HÁ USUÁRIO CADASTRADO OU SENHA INCORRETA, 1 USUÁRIO CORRETO
  let user = req.query.user;
  let senha = req.query.senha;
  for(let i = 0; i < users.length; i++){
    if(users[i].user == user && users[i].senha == senha){
      req.session.user = user;
      req.session.senha = senha;
      res.send("1");
      return;
    }
  }
  res.send("0");
});

app.get('/sair', function(req, res) {
  req.session.destroy(function() {
    res.send("200");
  });
});

app.post('/enviar', function(req, res){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: req.session.user,
      pass: req.session.senha
    }
  });

  let mailOptions = {
    from: req.session.user,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.send(error);
    } else {
      res.send("1");
    }
  });
});

app.listen(3000);