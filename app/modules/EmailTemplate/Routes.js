module.exports = (app, express) => {

    const router = express.Router();

    const Globals = require("../../../configs/Globals");
    const EmailController = require('./Controller');
    const config = require('../../../configs/configs');
    const Validators = require("./Validator");

    router.post('/addUpdateEmail', Globals.isAdminAuthorised(['email_template_edit', 'email_template_create']), Validators.templateValidator(), Validators.validate, (req, res, next) => {
        const emjObj = (new EmailController()).boot(req, res);
        return emjObj.addUpdateEmail();
    });

    router.post('/deleteTemplate', Globals.isAdminAuthorised(['email_template_delete']), Validators.deleteValidator(), Validators.validate, (req, res, next) => {
        const emjObj = (new EmailController()).boot(req, res);
        return emjObj.deleteEmail();
    });
    router.post('/changeTemplateStatus', Globals.isAdminAuthorised(['email_template_status_update']), Validators.statusValidator(), Validators.validate, (req, res, next) => {
        const emjObj = (new EmailController()).boot(req, res);
        return emjObj.changeStatus();
    });

    router.get('/detailEmail/:id', Globals.isAdminAuthorised(['email_template_view_list']), Validators.detailValidator(), Validators.validate, (req, res, next) => {
        const emjObj = (new EmailController()).boot(req, res);
        return emjObj.detailEmail();
    });

    router.post('/listEmail', Globals.isAdminAuthorised(['email_template_view_list']), Validators.listingValidator(), Validators.validate, (req, res, next) => {
        const emjObj = (new EmailController()).boot(req, res);
        return emjObj.listEmail();
    });

    router.post('/searchEmail', Globals.isAdminAuthorised(), (req, res, next) => {
        const emjObj = (new EmailController()).boot(req, res);
        return emjObj.searchEmail();
    });

    router.post('/emailColumnSettings', Globals.isAdminAuthorised(), Validators.saveColumnValidator(), Validators.validate, (req, res, next) => {
        const userObj = (new EmailController()).boot(req, res);
        return userObj.saveColumnSettings();
    });

    router.post('/getEmailColumnValues', Globals.isAdminAuthorised(), Validators.fieldsValidator(), Validators.validate, async (req, res, next) => {
        const userObj = (new EmailController()).boot(req, res);
        return userObj.getColumnValues();
    });

    app.use(config.baseApiUrl, router);
}