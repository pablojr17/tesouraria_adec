// api/server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Aponta para o seu db.json
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Opcional: Adicione um rewriter se quiser que as rotas da Vercel sejam mais limpas
// Por exemplo, /api/entradas em vez de /entradas
server.use(jsonServer.rewriter({
  '/api/*': '/$1' // Redireciona /api/entradas para /entradas
}));

server.use(router);

// Exporte o servidor para ser usado pela Vercel como uma serverless function
module.exports = server;
