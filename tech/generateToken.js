const axios = require("axios");
const ticket = require("./general.json");
const fs = require("fs");
const qs = require("qs");
const [, , type, username, password] = process.argv;
const FormData = require("form-data");

async function generateToken() {
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const credentials = `${username}:${password}`;
  const encodedCredentials = btoa(credentials);
  const Token = `${capitalizedType} ${encodedCredentials}`;
  console.log(Token);
}

generateToken();
