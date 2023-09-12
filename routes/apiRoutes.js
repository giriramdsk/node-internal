// const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');


module.exports = function (app) {
	    console.log("hi");
	// const express=require('express')

	const controller = require('../controller/user.controller.js');
	const roleController = require('../controller/roles.controller.js');
	// const client_role_getController = require('../controller/client_role_get.controller.js');
	const subscription_packagesController = require('../controller/subscription_packages.controller.js');
	const librariesController = require('../controller/libraries.controller.js');
	const organization_librariesController = require('../controller/organization_libraries.controller.js');
	const organizationController = require('../controller/organization.controller.js');
	const countriesController = require('../controller/countries.controller.js');
	const chaptersController = require('../controller/chapters.controller.js');
	const standardsController = require('../controller/standards.controller.js');
	const sub_standardsController = require('../controller/sub_standards.controller.js');
	const surveyor_categoriesController = require('../controller/surveyor_categories.controller.js');
	const session_classesController = require('../controller/session_classes.controller.js');
	const upload = require("../middleware/upload");
	const unit_focus_areasController = require('../controller/unit_focus_areas.controller.js');
	const admin_activitiesController = require('../controller/admin_activities.controller.js');
	const activity_elementsController = require('../controller/activity_elements.controller.js');

	// app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], controller.signup);

	// app.post('/api/auth/signin', controller.signin);

	// app.get('/api/test/user', [authJwt.verifyToken], controller.userContent);

	// app.get('/api/test/pm', [authJwt.verifyToken, authJwt.isPmOrAdmin], controller.managementBoard);

	// app.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

	app.post('/api/user/create', controller.create);
	app.get('/api/user/get', controller.get);
	app.post('/api/admin/create', controller.AdminCreate);
	app.post('/api/user/register', controller.register);
	app.post('/api/auth/login', controller.login);
	app.put('/api/passwordset', [authJwt.verifyToken], controller.passwordset)


	app.post('/api/role/create', roleController.create)
	app.put('/api/role/update', roleController.update)
	app.get('/api/role/get', roleController.get)
	app.get('/api/role/getById/:id', roleController.getById)
	app.delete('/api/role/delete/:id', roleController.delete)


	// app.post('/api/client_role_get/create', client_role_getController.create)
	// app.put('/api/client_role_get/update', client_role_getController.update)
	// app.get('/api/client_role_get/get', client_role_getController.get)
	// app.get('/api/client_role_get/getById', client_role_getController.getById)
	// app.delete('/api/client_role_get/delete', client_role_getController.delete)

	// app.post('/api/companies/create', companiesController.create)
	// apupost('/api/companies/update', companiesController.update)
	// app.get('/api/companies/get', companiesController.get)
	// app.get('/api/mastercompanies/get', companiesController.mastercompanies)
	// app.get('/api/companies/getById/:id', companiesController.getById)
	// app.get('/api/companies/getByMasterCompanyId/:id', companiesController.getByMasterCompanyId)
	// app.delete('/api/companies/delete/:id', companiesController.delete)
	// app.get('/api/companies/statusChange/:id/:status', companiesController.statusChange)

	app.post('/api/organization/create', organizationController.create)
	app.put('/api/organization/update', organizationController.update)
	app.get('/api/organization/get', organizationController.get)
	app.get('/api/organization/getById/:id', organizationController.getById)
	app.delete('/api/organization/delete/:id', organizationController.delete)
	app.delete('/api/organization/statusChange/:id/:status', organizationController.statusChange)
	app.get('/api/organization/getByMasterCompanyId/:id', organizationController.getByMasterCompanyId)
	app.get('/api/masterorganization/get', organizationController.masterorganization)
	app.get('/api/city/get', organizationController.cityGet)


	app.post('/api/subscription_packages/create', subscription_packagesController.create)
	app.put('/api/subscription_packages/update', subscription_packagesController.update)
	app.get('/api/subscription_packages/get', subscription_packagesController.get)
	app.get('/api/subscription_packages/getById/:id', subscription_packagesController.getById)
	app.delete('/api/subscription_packages/delete/:id', subscription_packagesController.delete)

	//client admin with company and role
	app.get('/api/ClientAdminGet/get', controller.ClientAdminGet);

	// app.post('/api/organization_libraries/create', organization_librariesController.create)
	// apupost('/api/organization_libraries/update', organization_librariesController.update)
	// app.get('/api/organization_libraries/get', organization_librariesController.get)
	// app.get('/api/organization_libraries/getById/:id', organization_librariesController.getById)
	// app.delete('/api/organization_libraries/delete/:id', organization_librariesController.delete)
	// app.delete('/api/organization_libraries/statusChange/:id/:status', organization_librariesController.statusChange)

	app.post('/api/libraries/create', librariesController.create)
	app.put('/api/libraries/update', librariesController.update)
	app.get('/api/libraries/get', librariesController.get)
	app.get('/api/libraries/getById/:id', librariesController.getById)
	app.delete('/api/libraries/delete/:id', librariesController.delete)
	app.get('/api/libraries/statusChange/:id/:status', librariesController.statusChange)


	app.post('/api/countries/create', countriesController.create)
	app.put('/api/countries/update', countriesController.update)
	app.get('/api/countries/get', countriesController.get)
	app.get('/api/countries/getById/:id', countriesController.getById)
	app.delete('/api/countries/delete/:id', countriesController.delete)
	app.get('/api/countries/statusChange/:id/:status', countriesController.statusChange)

	app.post('/api/chapters/create', chaptersController.create)
	app.put('/api/chapters/update', chaptersController.update)
	app.get('/api/chapters/get', chaptersController.get)
	app.get('/api/chapters/getById/:id', chaptersController.getById)
	app.delete('/api/chapters/delete/:id', chaptersController.delete)
	app.get('/api/chapters/statusChange/:id/:status', chaptersController.statusChange)

	app.post('/api/standards/create', standardsController.create)
	app.put('/api/standards/update', standardsController.update)
	app.get('/api/standards/get', standardsController.get)
	app.get('/api/standards/getById/:id', standardsController.getById)
	app.delete('/api/standards/delete/:id', standardsController.delete)
	app.get('/api/standards/statusChange/:id/:status', standardsController.statusChange)
	app.get('/api/standards/getChapterById/:id', standardsController.getChapterById)

	app.post('/api/sub_standards/create', upload.single("file"), sub_standardsController.create)
	app.put('/api/sub_standards/update', sub_standardsController.update)
	app.get('/api/sub_standards/get', sub_standardsController.get)
	app.get('/api/sub_standards/getById/:id', sub_standardsController.getById)
	app.delete('/api/sub_standards/delete/:id', sub_standardsController.delete)
	app.get('/api/sub_standards/statusChange/:id/:status', sub_standardsController.statusChange)
	app.get('/api/sub_standards/getByStandardId/:id', sub_standardsController.getByStandardId)

	app.post('/api/surveyor_categories/create', surveyor_categoriesController.create)
	app.put('/api/surveyor_categories/update', surveyor_categoriesController.update)
	app.get('/api/surveyor_categories/get', surveyor_categoriesController.get)
	app.get('/api/surveyor_categories/getById/:id', surveyor_categoriesController.getById)
	app.delete('/api/surveyor_categories/delete/:id', surveyor_categoriesController.delete)
	app.get('/api/surveyor_categories/statusChange/:id/:status', surveyor_categoriesController.statusChange)

	app.post('/api/session_classes/create', session_classesController.create)
	app.put('/api/session_classes/update', session_classesController.update)
	app.get('/api/session_classes/get', session_classesController.get)
	app.get('/api/session_classes/getById/:id', session_classesController.getById)
	app.delete('/api/session_classes/delete/:id', session_classesController.delete)
	app.get('/api/session_classes/statusChange/:id/:status', session_classesController.statusChange)

	app.get('/api/unit_focus_areas/get', unit_focus_areasController.get)

	app.post('/api/admin_activities/create', upload.single("file"), admin_activitiesController.create)
	app.post('/api/admin_activities/update', admin_activitiesController.update)
	app.get('/api/admin_activities/get', admin_activitiesController.get)
	app.get('/api/admin_activities/getById/:id', admin_activitiesController.getById)
	app.delete('/api/admin_activities/delete/:id', admin_activitiesController.delete)
	app.get('/api/admin_activities/statusChange/:id/:status', admin_activitiesController.statusChange)

	app.get('/api/admin_activities/activitytypeGet', admin_activitiesController.activityTypeGet)


	app.post('/api/activity_elements/create', activity_elementsController.create)
	app.post('/api/activity_elements/update', activity_elementsController.update)
	app.get('/api/activity_elements/get', activity_elementsController.get)
	app.get('/api/activity_elements/getById/:id', activity_elementsController.getById)
	app.delete('/api/activity_elements/delete/:id', activity_elementsController.delete)
	app.get('/api/activity_elements/statusChange/:id/:status', activity_elementsController.statusChange)
	// ===client admin===
	const client_admin_activitiesController = require('../controller/client_admin_activities.controller.js');
	app.post('/api/client_admin_activities/create', client_admin_activitiesController.create)
	app.post('/api/client_admin_activities/update', client_admin_activitiesController.update)
	app.get('/api/client_admin_activities/get', client_admin_activitiesController.get)
	app.get('/api/client_admin_activities/getById/:id', client_admin_activitiesController.getById)
	app.delete('/api/client_admin_activities/delete/:id', client_admin_activitiesController.delete)
	app.get('/api/client_admin_activities/statusChange/:id/:status', client_admin_activitiesController.statusChange)


	const activity_mappingController = require('../controller/activity_mapping.controller.js');
	app.post('/api/activity_mapping/create', activity_mappingController.create)
	app.post('/api/activity_mapping/update', activity_mappingController.update)
	app.get('/api/activity_mapping/get', activity_mappingController.get)
	app.get('/api/activity_mapping/getById/:id', activity_mappingController.getById)
	app.delete('/api/activity_mapping/delete/:id', activity_mappingController.delete)
	app.get('/api/activity_mapping/statusChange/:id/:status', activity_mappingController.statusChange)

	const auditsController = require('../controller/audits.controller.js');
	app.post('/api/audits/create', auditsController.create)
	app.post('/api/audits/update', auditsController.update)
	app.get('/api/audits/get', auditsController.get)
	app.get('/api/audits/getById/:id', auditsController.getById)
	app.delete('/api/audits/delete/:id', auditsController.delete)
	app.get('/api/audits/statusChange/:id/:status', auditsController.statusChange)
}