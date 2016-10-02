
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello');
});

Parse.Cloud.define('syncData', function(req, response){
	var Class = Parse.Object.extend(req.params.parseClass);
	var parseClass = new Class();
	parseClass.set("batchName":"test");
	parseClass.save(null, { //JSON.parse(req.params.data)
		success: function(parseClass){
			response.success(parseClass);
		},
		error: function(error){
			response.error(error);
		}
	});
});