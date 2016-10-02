
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello');
});

Parse.Cloud.define('syncData', function(req, response){
	
	var Class = Parse.Object.extend(req.params.parseClass);
	var parseClass = new Class();
	parseClass.set("batchName":"test");
	// parseClass.save(null, {
	// 	success: function(parseClass){
	// 		response.success(parseClass);
	// 	},
	// 	error: function(error){
	// 		response.error(error);
	// 	}
	// });

	response.success('succes...');
});