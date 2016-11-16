var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var db = mongoose.createConnection('mongodb://achyut:crossover@ds155097.mlab.com:55097/crossoverapp');

// mongoose.connection;

var UserSchema = mongoose.Schema({
	
	password:{
		type: String
	},
	email:{
		type: String
	},
	name:{
		type: String
	}
});

var User = module.exports = db.model('User',UserSchema);

module.exports.getUserById = function(id,callback){
	console.log('By id '+id);
	User.findById(id,callback);
}

module.exports.getUserByEmail = function(email,callback){

	var query = {email: email};
	console.log('By email '+email);
	User.findOne(query,callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    callback(null,isMatch);
	});
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
   	 });
	});
	
}