
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello');
});

Parse.Cloud.define('syncData', function(req, response){
	var CC = Parse.Object.extend("Batches");
	//Parse.Cloud.useMasterKey();
	var parseClass = new CC();
	parseClass.setACL(new Parse.ACL(Parse.User.current()));
	parseClass.save(req.params.data, {
		success: function(parseClass){
			response.success(parseClass);
		},
		error: function(data,error){
			response.error(error);
		}
	});
});