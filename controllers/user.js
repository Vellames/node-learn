module.exports = function(app) {
    return {
        login: function (req, res) {
            req.session.username = req.body.user.login;
            res.redirect("/chat");
        }
    }
};