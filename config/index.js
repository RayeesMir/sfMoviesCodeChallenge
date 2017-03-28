module.exports={
	baseUrl:"https://data.sfgov.org/resource",
	// baseUrl:"http://localhost:3000",
	endPoints:{
		movies:"/wwmu-gmzc.json"
		// movies:"/movies"
	},
	geoCodeoptions: {
		provider: 'google',
		httpAdapter: 'https', 
		apiKey: "AIzaSyCb1TbW8x26LIsipElh4T_AdKD-cQnbGgE", 
		formatter: null 
	},
	retryTime:5,		//retry number of times to get geolocation before failing
	intervalTime:1000,	//in miliseconds,
	city:"San Francisco, CA",
	elasticSearch:{
		host:"127.0.0.1",
		port:"9200",
		log:"error"
	},
	mongodb:{
		host:"127.0.0.1",
		primary:"sfmovies",
		secondary:"cronJobs",
		protocol:"mongodb://"
	},
	getDbString:function(db) {
		return this.mongodb.protocol+this.mongodb.host+'/'+this.mongodb[db]
	}
}