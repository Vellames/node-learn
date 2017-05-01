module.exports = function(app){
    var chatController = app.controllers.chat;
    app.get("/chat", chatController.index);
};