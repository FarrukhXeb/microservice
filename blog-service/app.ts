import express from 'express';
import getBlogsController from './controllers/get-blogs.controller';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.express.use(express.json());
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World! From Blog Service',
      });
    });
    router.get('/blogs', getBlogsController);
    router.post('/blogs', (req, res) => {
      return res.json(req.body);
    });
    this.express.use('/', router);
  }

  //   Method to start the server
  public listen(port: number): void {
    this.express.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }
}

export default App;
