
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello');
});

Parse.Cloud.define('sync', function(req, res){
	response.success(req);
	// var Class = Parse.Object.extend(req.params.parseClass);
	// var parseClass = new Class();
	// parseClass.set(req.data);
	// parseClass.save(null, {
	// 	success: function(parseClass){
	// 		response.success(parseClass);
	// 	},
	// 	error: function(error){
	// 		response.error(error);
	// 	}
	// });
});