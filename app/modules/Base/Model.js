/****************************
 COMMON MODEL
 ****************************/
let _ = require("lodash");

class Model {

    constructor(collection) {
        console.log(collection)

        this.collection = collection;
    }

    // Store Data
    store(data, options = {}) {
        return new Promise((resolve, reject) => {
            console.log(options);
    
            this.collection.create(data)
                .then(createdObject => {
                    resolve(createdObject);
                })
                .catch(err => {
                    reject({ message: err, status: 0 });
                });
        });
    }
    

    bulkInsert(data) {
        return new Promise((resolve, reject) => {
            this.collection.collection.insert(data, (err, result) => {
                if (err) {
                    reject("Find duplicate Users");
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model;