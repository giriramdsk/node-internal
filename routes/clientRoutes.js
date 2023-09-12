// const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function (app) {
    const client_rolesController = require('../controller/client_roles.controller.js');
    app.post('/clientapi/client_roles/create',client_rolesController.create)
    app.post('/clientapi/client_roles/update',client_rolesController.update)
    app.get('/clientapi/client_roles/get',client_rolesController.get)
    app.get('/clientapi/client_roles/getById/:id',client_rolesController.getById)
    app.delete('/clientapi/client_roles/delete/:id',client_rolesController.delete)
    app.get('/clientapi/client_roles/statusChange/:id/:status',client_rolesController.statusChange)


    app.get('/clientapi/client_roles/getUserByMasterId/:id',client_rolesController.getUserByMasterId)
    app.get('/clientapi/client_roles/userAssignedRoles/:id',client_rolesController.userAssignedRoles)

}
