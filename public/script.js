function cadastrar(){
  let user = document.getElementById("user").value;
  let senha = document.getElementById("pass").value;
  verificaCadastro(user, senha, cadastro);
}

function verificaCadastro(user, senha, cb){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/verificaCad", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        cb(user, senha, xmlhttp.responseText);
    }
  }
  xmlhttp.send("user=" + user);
}

function cadastro(user, senha, result){
  if(result == '1'){
    document.getElementById("popup").innerHTML = "Usuário já existente";
    document.getElementById("popup").style.visibility = "inherit";
    setTimeout(tirarAlerta, 5000);
    return;
  }
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/cadastrar", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      if(xmlhttp.responseText == "1"){
        location.href = '/';
      }
      else{
        document.getElementById("popup").innerHTML = "Erro ao realizar cadastro";
        document.getElementById("popup").style.visibility = "inherit";
        setTimeout(tirarAlerta, 5000);
      }
    }
  }
  xmlhttp.send("user=" + user + "&senha=" + senha);
}

function entrar(){
  let user = document.getElementById("user").value;
  let senha = document.getElementById("pass").value;
  verificaCadastro(user, senha, logar);
}

function logar(user, senha, result){
  if(result == '0'){
    document.getElementById("popup").innerHTML = "Usuário não existente";
    document.getElementById("popup").style.visibility = "inherit";
    setTimeout(tirarAlerta, 5000);
    return;
  }
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","/verificaLogin?user=" + user + "&senha=" + senha, true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      if(xmlhttp.responseText == "1"){
        location.href = '/';
      }
      else if(xmlhttp.responseText == "0"){
        document.getElementById("popup").innerHTML = "Usuário ou senha incorretos";
        document.getElementById("popup").style.visibility = "inherit";
        setTimeout(tirarAlerta, 5000);
      }
      else{
        document.getElementById("popup").innerHTML = "Erro ao realizar login";
        document.getElementById("popup").style.visibility = "inherit";
        setTimeout(tirarAlerta, 5000);
      }
    }
  }
  xmlhttp.send();
}

function sair(){
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","/sair", true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      if(xmlhttp.responseText != '200'){
        alert("Falha ao desconectar");
      }
      else{
        location.href = '/';
      }
    }
  }
  xmlhttp.send();
}

function enviarEmail(){
  let sub = document.getElementById("nome").value;
  let to = document.getElementById("dest").value;
  let text = document.getElementById("msg").value;

  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST","/enviar", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      if(xmlhttp.responseText == "1"){
        document.getElementById("nome").value = '';
        document.getElementById("dest").value = '';
        document.getElementById("msg").value = '';
        alert("Email enviado");
      }
      else{
        alert("Erro: " + xmlhttp.responseText);
      }
    }
  }
  xmlhttp.send("subject=" + sub + "&to=" + to + "&text=" + text);
}

function tirarAlerta(){
  document.getElementById("popup").style.visibility = "hidden";
}