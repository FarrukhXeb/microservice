import express from 'express';
import httpProxy from 'express-http-proxy';
import connectToMongoose from './config/mongoose';
import {
  successHandler,
  errorHandler,
  notFoundHandler,
  developmentErrors,
  productionErrors,
} from './config/logging';
import Passport from './middleware/passport';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(successHandler);
    this.express.use(errorHandler);
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
    if (process.env.NODE_ENV === 'development') {
      this.express.use(developmentErrors);
    } else {
      this.express.use(productionErrors);
    }
    this.express.use(notFoundHandler);
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
