const express = require("express");
const app = express();
const mongoose = require("mongoose");
const route = require("./route/index");
const createEventStore = require('./es');
const es = createEventStore();
app.use(express.json());


function initEventStore() {
  return new Promise((resolve) => {
    es.on('connect', () => {
      console.log('[eventstore] storage connected');
    });

    es.init(() => {
      console.log('[eventstore] initialized')
      resolve();
    })
  })
}



//congif mongoose
const connectdb = async () => {
  try {
    await mongoose.connect(
      "mongodb://admin:admin@localhost:27017/test_eventstore?authSource=admin",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      }
    );
    console.log("connect success");
  } catch (error) {
    console.log("connect failed ..");
  }
};


connectdb();
initEventStore();
route(app,es);

app.listen(3000, () => {console.log('[http] listening on 3000')})