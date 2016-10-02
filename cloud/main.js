
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

Parse.Cloud.define('SyncArray'	, function(req, response){
	var modelArray = [];
	var newACL = new Parse.ACL();
    newACL.setPublicReadAccess(false);
    newACL.setPublicWriteAccess(false);
    newACL.setReadAccess(req.params.userId,true);
    newACL.setWriteAccess(req.params.userId,true);
	var dataArray = req.params;

	for(var i=0; i< dataArray.length; i++){
		var CC = Parse.Object.extend(dataArray.parseClass);
		var parseClass = new CC();
		parseClass.set(dataArray.data);
		parseClass.setACL(newACL);
		modelArray[i] = parseClass;
	}


	Parse.Object.saveAll(modelArray,{
    success: function(list) {
      // All the objects were saved.
      response.success("ok " );  //saveAll is now finished and we can properly exit with confidence :-)
    },
    error: function(error) {
      // An error occurred while saving one of the objects.
      response.error("failure on saving list ");
    },
  });
});