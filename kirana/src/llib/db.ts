import { connect } from "mongoose";

let mongodbURL = process.env.MONGODB_URL;

if (!mongodbURL) {
  throw new Error("db error");
}

let catched = global.mongoose;

if (!catched) {
  catched = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  if (catched.conn) {
    return catched.conn;
  }
  if (!catched.promise) {
    catched.promise = connect(mongodbURL).then((conn) => conn.connection);
  }

  try {
    const conn = await catched.promise;
    return conn;
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
