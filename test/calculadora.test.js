// test("espero que de certo", () => {
//   expect(2).toBe(2);
// });

const calculadora = require("../models/calculadora.js");

test("somar 2 + 2 devera retornar 4", () => {
  const resultado = calculadora.somar(2, 2);
  expect(resultado).toBe(4);
});
