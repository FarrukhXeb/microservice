import express from 'express';
import httpProxy from 'express-http-proxy';
import connectToMongoose from './config/mongoose';
import Passport from './middleware/passport';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    const passport = Passport();
    passport.initialize();
    // Made our API gateway to authenticate the user before forwarding the request to the microservices
    this.express.use('/blogs', passport.authenticate(), (req, res, next) =>
      httpProxy('http://localhost:3001')(req, res, next)
    );
    this.express.use('/comments', passport.authenticate(), (req, res, next) =>
      httpProxy('http://localhost:3002')(req, res, next)
    );
    connectToMongoose();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World! API gateway',
      });
    });
  }

  //   Method to start the server
  public listen(port: number): void {
    this.express.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }
}

export default App;
