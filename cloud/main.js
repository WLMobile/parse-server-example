
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello');
});

Parse.Cloud.define('sync', function(req, res){
	 var Class = Parse.Object.extend(req.class);
	 var parseClass = new Class();
	 parseClass.set(req.data);
	parseClass.save(null, {
		success: function(parseClass){
			response.success(parseClass);
		},
		error: function(error){
			response.error(error);
		}
	});
});