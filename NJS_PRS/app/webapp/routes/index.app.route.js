/**
 * Created by hfjylzh on 2/20/2017.
 */
'use strict';


module.exports = function (app) {
    // Root routing
    var indexController = require('../controllers/index.app.controller');


    app.route('/index').get(indexController.index);

    app.route('/clearSearch/:id').get(indexController.clearSearch);

    app.route('/h/suggest.json').get(indexController.getSuggest);
    // app.route('/weChat/companyIndex').get(weChatController.companyIndex);
    //
    // app.route('/weChat/company/:segmentType').get(weChatController.companyIntroduction);

};