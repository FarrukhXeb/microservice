import mongoose from 'mongoose';
import Config from './constants';

const connect = () => {
  mongoose
    .connect(Config.monogUrl)
    .then(() => {
      return console.log(`Successfully connected to ${Config.monogUrl}`);
    })
    .catch((error) => {
      console.log('Error connecting to database: ', error);
      return process.exit(1);
    });
};

export default connect;
