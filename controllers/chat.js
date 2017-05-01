module.exports = function(app){
    return {
        index: function(req, res){
            console.log(req.session.username);
            res.render("chat", {username: req.session.username});
        }
    }
};