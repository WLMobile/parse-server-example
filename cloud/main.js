
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello');
});

Parse.Cloud.define('syncData', function(req, response){
	var CC = Parse.Object.extend("Batches");
	Parse.Cloud.useMasterKey();
	var parseClass = new CC();
	console.log(typeof req.params.data);
	parseClass.set(JSON.parse(req.params.data));
	parseClass.save(null, {
		success: function(parseClass){
			response.success(parseClass);
		},
		error: function(data,error){
			response.error(error);
		}
	});

	//response.success('succes...');
});