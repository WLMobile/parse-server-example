
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello');
});

Parse.Cloud.define('syncData', function(req, response){
	var CC = Parse.Object.extend(req.params.parseClass);
	//Parse.Cloud.useMasterKey();
	var parseClass = new CC();
	var newACL = new Parse.ACL();
    newACL.setPublicReadAccess(false);
    newACL.setPublicWriteAccess(false);
    newACL.setReadAccess(req.params.data.userId,true);
    newACL.setWriteAccess(req.params.data.userId,true);
	parseClass.setACL(newACL);
	parseClass.set(req.params.data);
	parseClass.save(null, {
		success: function(parseClass){
			response.success(parseClass);
		},
		error: function(data,error){
			response.error(error);
		}
	});
});