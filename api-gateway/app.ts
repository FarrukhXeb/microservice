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
import loginController from './controllers/loginController';
import registerController from './controllers/registerController';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(successHandler);
    this.express.use(errorHandler);
    const passport = Passport();
    this.express.use(passport.initialize());
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
    this.express.get('/', (req, res) => {
      res.json({
        message: 'Hello World! API gateway',
      });
    });
    this.express.post('/login', loginController);
    this.express.post('/register', registerController);
  }

  //   Method to start the server
  public listen(port: number): void {
    this.express.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }
}

export default App;
