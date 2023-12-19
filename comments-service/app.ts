import express from 'express';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World! From Comments Service',
      });
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
