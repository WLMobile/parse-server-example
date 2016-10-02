
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello');
});

Parse.Cloud.define('sync', function(req, res){
	var Class = Parse.Object.extend(req.class);
	var class = new Class();
	class.set(req.data);
	class.save(null, {
		success: function(class){
			response.success(class);
		},
		error: function(error){
			response.error(error);
		}
	})
});