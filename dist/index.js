'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
const setupApp = (app) => {
  app.use(express_1.default.json()); // middleware для парсинга JSON в теле запроса
  // основной роут
  app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
  });
  return app;
};
setupApp(app);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
