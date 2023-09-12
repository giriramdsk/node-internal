/****************************
 MONGOOSE SCHEMAS
 ****************************/
let config = require('./configs');
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let mongoDBOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // reconnectTries: Number.MAX_VALUE,
    // useUnifiedTopology: true,
    // reconnectInterval: 1000,
    // keepAlive: 1,
    // connectTimeoutMS: 30000,
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // native_parser: true,
    // poolSize: 5
}

module.exports = function () {
    var db = mongoose.connect(config.db, mongoDBOptions).then(
        (connect) => { console.log('MongoDB connected') },
        (err) => { console.log('MongoDB connection error', err) }
    );
    // mongoose.set('useCreateIndex', true);
    return db;
};
