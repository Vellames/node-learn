module.exports = function(app){
    var userController = app.controllers.user;
    app.post("/user/login", userController.login);
};