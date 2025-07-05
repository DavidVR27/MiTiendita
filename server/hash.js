const bcrypt = require('bcrypt');

const password = '123456'; // Cambia esto por la contraseña que quieras hashear

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hash:', hash);
});
