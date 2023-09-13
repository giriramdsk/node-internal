/****************************
 Common services
 ****************************/
const _ = require("lodash");
const bcrypt = require('bcrypt');
const https = require('https');
const Moment = require('moment');
const i18n = require("i18n");

// const PushNotification = require('./PushNotification');
const Config = require('../../configs/configs');
const Users = require('../modules/User/Schema').Users;
const RequestBody = require("./RequestBody");
// const File = require('./File');
const Model = require("../modules/Base/Model");
const ColumnSettings = require('../modules/UserManagement/Schema').ColumnSettings;
const FilterSettings = require('../modules/UserManagement/Schema').FilterSettings;

class Common {

    /********************************************************
     Purpose:Service for error handling
     Parameter:
     {
         errObj: {},
         schema: {}
     }
     Return: JSON String
     ********************************************************/
    errorHandle(errObj, schema = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let errorMessage = "Internal server error.";
                if (errObj && errObj.code) {
                    switch (errObj.code) {
                        case 11000:
                            errorMessage = "Duplicate key error";
                            if (schema) {
                                const indexes = [[{ _id: 1 }, { unique: true }]].concat(schema.indexes());
                                await indexes.forEach(async (index) => {
                                    const paths = Object.keys(index[0]);
                                    if ((errObj.message).includes(paths[0])) {
                                        errorMessage = ` ${paths[0]} expects to be unique. `;
                                    }
                                });
                            }
                            break;
                        case 0:
                            errorMessage = "";
                            break;
                        case 1:
                            errorMessage = "";
                            break;
                        default:
                            break;
                    }
                } else if (errObj && errObj.message && errObj.message.errmsg) {
                    errorMessage = errObj.message.errmsg;
                } else if (errObj && errObj.errors) {
                    if (schema) {
                        schema.eachPath(function (path) {
                            console.log('path', path);
                            if (_.has(errObj.errors, path) && errObj.errors[path].message) {
                                errorMessage = errObj.errors[path].message;
                            }
                        });

                    }
                } else if (errObj && errObj.message && errObj.message.errors) {
                    if (schema) {
                        schema.eachPath(function (path) {
                            console.log('path', path);
                            if (_.has(errObj.message.errors, path) && errObj.message.errors[path].message) {
                                errorMessage = errObj.message.errors[path].message;
                                console.log('errorMessage', errorMessage);
                            }
                        });

                    }
                }
                return resolve(errorMessage);
            } catch (error) {
                return reject({ status: 0, message: error });
            }
        });
    }
    /********************************************************
     Purpose: Service for sending push notification
     Parameter:
     {
        data:{
            deviceToken:"",
            device:"",
            title:"",
            message:""
        }
     }
     Return: JSON String
     ********************************************************/
    sendPushNotification(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data.deviceToken && data.device) {
                    if (data.device == 'ios') {
                        let notificationData = {
                            "deviceToken": data.deviceToken,
                            "title": data.title ? data.title : 'Title',
                            "message": data.message ? data.message : "Message",
                            "firstName": "testname"
                        };
                        await PushNotification.send(notificationData);

                    } else if (data.device == 'android') {
                        let notificationData = {
                            "deviceToken": data.deviceToken,
                            "title": data.title ? data.title : 'Title',
                            "message": data.message ? data.message : "Message"
                        };
                        await PushNotification.sendAndroid(notificationData);
                    }

                }
                resolve();
            } catch (error) {
                console.log('error in send', error);
                resolve();
                // reject(error)
            }
        });

    }
    /********************************************************
    Purpose: Encrypt password
    Parameter:
        {
            "data":{
                "password" : "test123"
            }
        }
    Return: JSON String
    ********************************************************/
    ecryptPassword(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data && data.password) {
                    let password = bcrypt.hashSync(data.password, 10);
                    return resolve(password);
                }
                return resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    /********************************************************
    Purpose: Compare password
    Parameter:
        {
            "data":{
                "password" : "Buffer data", // Encrypted password
                "savedPassword": "Buffer data" // Encrypted password
            }
        }
    Return: JSON String
    ********************************************************/
    verifyPassword(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let isVerified = false;
                if (data && data.password && data.savedPassword) {
                    var base64data = Buffer.from(data.savedPassword, 'binary').toString();
                    isVerified = await bcrypt.compareSync(data.password, base64data)
                }
                return resolve(isVerified);
            } catch (error) {
                reject(error);
            }
        });
    }
    /********************************************************
    Purpose: Validate password
    Parameter:
        {
            "data":{
                "password" : "test123",
                "userObj": {}
            }
        }
    Return: JSON String
    ********************************************************/
    validatePassword(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data && data.password) {
                    if (data.userObj && _.isEqual(data.password, data.userObj.firstname)) {
                        return resolve({ status: 0, message: i18n.__("PASSWORD_NOT_SAME_FIRSTNAME") });
                    }
                    // Check new password is already used or not
                    if (Config.dontAllowPreviouslyUsedPassword && Config.dontAllowPreviouslyUsedPassword == 'true' && data.userObj && data.userObj.previouslyUsedPasswords && Array.isArray(data.userObj.previouslyUsedPasswords) && data.userObj.previouslyUsedPasswords.length) {
                        let isPreviouslyUsed = _.filter(data.userObj.previouslyUsedPasswords, (previouslyUsedPassword) => {
                            var base64data = Buffer.from(previouslyUsedPassword, 'binary').toString();
                            return bcrypt.compareSync(data.password, base64data)
                        });
                        if (isPreviouslyUsed && Array.isArray(isPreviouslyUsed) && isPreviouslyUsed.length) {
                            return resolve({ status: 0, message: i18n.__("ALREADY_USED_PASSWORD") });
                        }
                    }
                    return resolve({ status: 1, message: "Valid password." });
                } else {
                    return resolve({ status: 0, message: "Password required." });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    /********************************************************
     Purpose: Service for handling wrong password attempt
     Parameter:
     {
        data:{
            user:{},
            ip:"10.2.2.43",
            password:"test"
        }
     }
     Return: JSON String
     ********************************************************/
    handleWrongPasswordAttempt(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = data.user ? data.user : {};
                let ip = data.ip ? data.ip : null;
                let password = data.password ? data.password : null;
                const isPasswordCorrect = await this.verifyPassword({ password: password, savedPassword: user.password });

                if (user.failedAttempts && Array.isArray(user.failedAttempts) && user.failedAttempts) {
                    let filteredObj = _.filter(user.failedAttempts, (obj) => {
                        return _.isEqual(obj.ip, ip)
                    });

                    if (filteredObj && Array.isArray(filteredObj) && filteredObj.length && _.head(filteredObj)) {
                        filteredObj = _.head(filteredObj);
                        if (filteredObj.isBlocked) {
                            let blockedDate = Moment(filteredObj.blockedDate, 'YYYY-MM-DD HH:mm:ss');
                            let currentDate = Moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                            let duration = Moment.duration(currentDate.diff(blockedDate));
                            let minutes = duration.asMinutes();

                            if (minutes >= parseInt(Config.timeDurationOfBlockingAfterWrongAttempts)) {
                                let params = { "failedAttempts.$.isBlocked": false, "failedAttempts.$.attempts": isPasswordCorrect ? 0 : 1 };
                                await Users.findOneAndUpdate({ _id: user._id, "failedAttempts.ip": ip }, params, { new: true });
                                return !isPasswordCorrect ? resolve({ status: 0, message: i18n.__("INVALID_PASSWORD") }) : resolve();
                            } else {
                                return resolve({ status: 0, message: i18n.__("LOGIN_BLOCKED_TEMP") });
                            }

                        } else if (!isPasswordCorrect) {
                            let params = { $inc: { "failedAttempts.$.attempts": 1 } };
                            if (filteredObj.attempts >= parseInt(Config.allowedFailAttemptsOfLogin)) {
                                params = { "failedAttempts.$.isBlocked": true, "failedAttempts.$.blockedDate": new Date() };
                            }
                            await Users.findOneAndUpdate({ _id: user._id, "failedAttempts.ip": ip }, params, { new: true });
                            return resolve({ status: 0, message: i18n.__("INVALID_PASSWORD") });
                        }
                    } else if (!isPasswordCorrect) {
                        await Users.findOneAndUpdate({ _id: user._id }, { $push: { "failedAttempts": { "ip": ip, "attempts": 1 } } }, { new: true });
                        return resolve({ status: 0, message: i18n.__("INVALID_PASSWORD") });
                    }
                } else if (!isPasswordCorrect) {
                    await Users.findOneAndUpdate({ _id: user._id }, { $set: { "failedAttempts": [{ "ip": ip, "attempts": 1 }] } }, { new: true });
                    return resolve({ status: 0, message: i18n.__("INVALID_PASSWORD") });
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    /********************************************************
     Purpose: Service for listing records
     Parameter:
     {
        data:{
            bodyData:{},
            model:{}
        }
     }
     Return: JSON String
     ********************************************************/
    listing(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let bodyData = data.bodyData;
                let model = data.bodyData.model;
                let selectObj = data.selectObj ? data.selectObj : { "__v": 0 };
                if (bodyData.page && bodyData.pagesize) {
                    let skip = (bodyData.page - 1) * (bodyData.pagesize);
                    let sort = bodyData.sort ? bodyData.sort : { createdAt: -1 };
                    let filter = await this.constructFilter({ filter: bodyData.filter, search: data.search ? data.search : false, schema: data.schema, staticFilter: data.staticFilter });
                    let listing;
                    listing = await model.find(filter).sort(sort).skip(skip).limit(bodyData.pagesize).select(selectObj)
                    const total = await model.find(filter).countDocuments();

                    let columnKey = data.bodyData.columnKey;
                    if (columnKey) {
                        let columnSettings = await ColumnSettings.findOne({ key: columnKey }).select({ "_id": 0, "columns._id": 0 });
                        columnSettings = columnSettings && columnSettings.columns && Array.isArray(columnSettings.columns) ? columnSettings.columns : [];
                        return resolve({ status: 1, data: { listing, columnSettings }, page: bodyData.page, perPage: bodyData.pagesize, total: total });
                    } else {
                        return resolve({ status: 1, data: { listing }, page: bodyData.page, perPage: bodyData.pagesize, total: total });
                    }
                } else {
                    return resolve({ status: 0, message: "Page and pagesize required." })
                }
            } catch (error) {
                return reject(error)
            }
        });
    }
    /********************************************************
     Purpose: Service for searching records
     Parameter:
     {
        data:{
            bodyData:{},
            model:{}
        }
     }
     Return: JSON String
     ********************************************************/
    search(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let commonFilter = { $or: [{ isDeleted: { $exists: false } }, { $and: [{ isDeleted: { $exists: true } }, { isDeleted: false }] }] };
                let selectObj = data.selectObj ? data.selectObj : { "__v": 0 };
                let model = data.bodyData.model;
                let bodyData = data.bodyData;
                let filter = commonFilter;
                let k = bodyData.column ? bodyData.column : "_id";
                if (bodyData.filter) {
                    let ar = bodyData.filter;
                    for (let key in ar) {
                        let v = ar[key];
                        k = key;
                        filter = {
                            [key]: new RegExp(v, 'i')
                        }
                        if (bodyData.schema && !_.isEmpty(bodyData.schema) && bodyData.schema.path(key) && bodyData.schema.path(key).instance == 'Embedded') {  // For searching Role
                            filter = {
                                [key + '.' + key]: new RegExp(v, 'i')
                            }
                        }
                    }
                    filter = { $and: [filter, commonFilter] };
                }
                let arr = [];
                const searchedData = await model.find(filter).select(selectObj).limit(5);
                searchedData.filter((u) => {
                    if (bodyData.schema && !_.isEmpty(bodyData.schema) && bodyData.schema.path(k) && bodyData.schema.path(k).instance == 'Embedded') {
                        arr.push(u[k][k]);
                    } else {
                        arr.push(u[k]);
                    }
                });
                // return resolve({ status: 1, data: { [k]: arr } });
                return resolve({ status: 1, data: { listing: arr } });
            } catch (error) {
                return reject(error);
            }
        });
    }
    /********************************************************
     Purpose: Save column settings
     Parameter:
     {
        key: 'userListing',
        columns: [{key : 'firstName', status: false}, {key : 'lastName', status: false},{key : 'emailId', status: true}]
     }
     Return: JSON String
     ********************************************************/
    saveColumnSettings(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let bodyData = data.bodyData;
                if (bodyData['key']) {
                    let columnSettings = await ColumnSettings.findOne({ key: bodyData['key'] });
                    if (columnSettings) {
                        columnSettings = await ColumnSettings.findOneAndUpdate({ key: bodyData['key'] }, bodyData, { new: true });
                    } else {
                        columnSettings = await new Model(ColumnSettings).store(bodyData);
                    }
                    return resolve({ status: 1, data: columnSettings });
                } else {
                    return resolve({ status: 0, data: 'Key required.' });
                }
            } catch (error) {
                return reject(error);
            }
        });
    }
    /********************************************************
     Purpose: Save filter
     Parameter:
     {
        "filterName": "firstNameFilter",
        "key": 'userListing',
        "filter": [{"firstname": ["Neha","mad"]},{"lastname":["dodla"]}]
     }
     Return: JSON String
     ********************************************************/
    saveFilter(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let bodyData = data.bodyData;
                if (bodyData['key'] && bodyData['filterName'] && bodyData['filter']) {
                    let filterSettings = await FilterSettings.findOne({ key: bodyData['key'], filterName: bodyData['filterName'] });
                    if (filterSettings) {
                        filterSettings = await FilterSettings.findOneAndUpdate({ key: bodyData['key'], filterName: bodyData['filterName'] }, bodyData);
                    } else {
                        filterSettings = await new Model(FilterSettings).store(bodyData);
                    }
                    return resolve({ status: 1, data: filterSettings });
                } else {
                    return resolve({ status: 0, message: "key, filter and filtername required." })
                }
            } catch (error) {
                return reject(error);
            }
        });
    }
    /********************************************************
     Purpose: Get filters
     Parameter:
     {
     }
     Return: JSON String
     ********************************************************/
    getFilters(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let key = data.key;
                let filterSettings = await FilterSettings.find({ key: key }).select({ "createdAt": 0, "updatedAt": 0, "__v": 0, "key": 0 });
                return resolve({ status: 1, data: filterSettings });
            } catch (error) {
                reject(error);
            }
        });
    }
    /********************************************************
     Purpose: Delete filter
     Parameter:
     {
         filterId: ""
     }
     Return: JSON String
     ********************************************************/
    deleteFilter(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let key = data.key;
                let filterSettings = await FilterSettings.deleteOne({ key: key, _id: data.filterId });
                if (filterSettings.ok && filterSettings.deletedCount) {
                    return resolve({ status: 1, data: filterSettings, message: "Filter deleted successfully." });
                } else if (filterSettings.ok && filterSettings.n == 0) {
                    return resolve({ status: 0, message: "Filter not found." });
                } else {
                    return resolve({ status: 0, message: "Filter not deleted." });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    constructFilter(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let commonFilter = { ...data.staticFilter, $or: [{ isDeleted: { $exists: false } }, { $and: [{ isDeleted: { $exists: true } }, { isDeleted: false }] }] };
                let f = [];
                let filter1 = commonFilter;
                if (data.filter && Array.isArray(data.filter)) {
                    let filter = data.filter;
                    for (let index in filter) {
                        let ar = filter[index];
                        for (let key in ar) {
                            let filterObj = ar[key] && Array.isArray(ar[key]) ? ar[key] : [];
                            let valueArr = [];
                            filterObj.filter((value) => {
                                // valueArr.push({ [key]: value });
                                let obj;
                                if (data.schema && !_.isEmpty(data.schema) && data.schema.path(key) && data.schema.path(key).instance == 'Embedded') {
                                    obj = { [key + '.' + key]: value };
                                } else {
                                    obj = data.search ? { [key]: typeof value === 'string' ? new RegExp(value.toString().toLowerCase(), 'i') : value } : { [key]: value };
                                }
                                valueArr.push(obj);
                            });
                            if (valueArr.length) {
                                f.push({ $or: valueArr })
                            }
                        }
                        filter1 = { $and: [...f, commonFilter] };
                    }
                }
                resolve(filter1);
            } catch (error) {
                reject(error);
            }
        });
    }
    // downloadFile(data) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let bodyData = data.bodyData;
    //             let model = data.bodyData.model;
    //             let columns = bodyData && bodyData.columns ? bodyData.columns : ['firstname', 'lastname', 'username', 'emailId', 'mobile'];
    //             let filter = bodyData && bodyData.filter ? bodyData.filter : { isDeleted: false, emailVerificationStatus: true };
    //             filter = await this.constructFilter({ filter });
    //             const records = await model.find(filter).lean();
    //             const file = await (new File()).convertJsonToCsv({ jsonData: records, columns, fileName: 'userList', ext: data.ext });
    //             resolve({ status: 1, data: file });
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // }
    /********************************************************
     Purpose:Convert currency
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    convertCurrency(amount, fromCurrency, toCurrency) {
        return new Promise((resolve, reject) => {
            try {
                var apiKey = '424a618d3b6f3fde2877';
                fromCurrency = encodeURIComponent(fromCurrency);
                toCurrency = encodeURIComponent(toCurrency);
                var query = fromCurrency + '_' + toCurrency;

                var url = 'https://free.currconv.com/api/v7/convert?q=' + query + '&compact=ultra&apiKey=' + apiKey;

                https.get(url, (res) => {
                    var body = '';
                    res.on('data', (chunk) => { body += chunk; });

                    res.on('end', () => {
                        try {
                            var jsonObj = JSON.parse(body);
                            var val = jsonObj[query];
                            if (val) {
                                var total = val * amount;
                                return resolve({ status: 1, data: Math.round(total * 100) / 100 });
                            } else {
                                var err = new Error("Value not found for " + query);
                                return resolve({ status: 0, message: err });
                            }
                        } catch (e) {
                            console.log("Parse error: ", e);
                            return reject(e);
                        }
                    });
                }).on('error', (e) => {
                    console.log("Got an error: ", e);
                    return reject(e);
                });
            } catch (error) {
                return reject(error);
            }
        });
    }
    /********************************************************
     Purpose: Get single column values
     Parameter:
     {
        column: 'blogTitle'
     }
     Return: JSON String
    ********************************************************/
    async getColumnValues(bodyData) {
        try {
            let data = {
                search: true,
                bodyData: bodyData.bodyData,
                selectObj: { [bodyData.bodyData.column]: 1, _id: 0 }
            };
            let result = await this.search({ bodyData: data.bodyData });
            return result;
        } catch (error) {
            console.log(error);
            return { status: 0, message: error };
        }
    }
    /********************************************************
     Purpose: Change password validations
     Parameter:
     {
     }
     Return: JSON String
    ********************************************************/
    changePasswordValidation(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let passwordObj = data.passwordObj ? data.passwordObj : {}
                const samePassword = _.isEqual(passwordObj.oldPassword, passwordObj.newPassword);
                if (samePassword) {
                    return resolve({ status: 0, message: i18n.__("OLD_PASSWORD_NEW_PASSWORD_DIFFERENT") });
                }

                const status = await this.verifyPassword({ password: passwordObj.oldPassword, savedPassword: passwordObj.savedPassword });
                if (!status) {
                    return resolve({ status: 0, message: i18n.__("CORRECT_CURRENT_PASSWORD") });
                }

                let isPasswordValid = await this.validatePassword({ password: passwordObj.newPassword });
                if (isPasswordValid && !isPasswordValid.status) {
                    return resolve(isPasswordValid);
                }

                let password = await this.ecryptPassword({ password: passwordObj.newPassword });
                return resolve(password);
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = Common;