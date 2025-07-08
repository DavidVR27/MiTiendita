const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Hashea una contraseña de texto plano.
 * @param {string} password La contraseña a hashear.
 * @returns {Promise<string>} Una promesa que resuelve con la contraseña hasheada.
 */
const hashPassword = (password) => {
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compara una contraseña de texto plano con un hash.
 * @param {string} password La contraseña de texto plano.
 * @param {string} hash El hash a comparar.
 * @returns {Promise<boolean>} Una promesa que resuelve a true si coinciden, false si no.
 */
const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};