/****************************
 Configuration
 ****************************/
// For environment variables [will work with .env file]
// require('custom-env').env('dev')
require('dotenv').config();
// require('custom-env').env('production')
let ENV_VARIABLES = process.env;

console.log("ENV_VARIABLES", ENV_VARIABLES.db)

module.exports = {
    ...ENV_VARIABLES,  
}; 
