module.exports = function(app){
  return {
      index: function(req, res){
          res.render("index", {title: "Titulo", message: "Aloha"});
      }
  }
};