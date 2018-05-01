
# San Francisco Movies Search

### Live Demo 
   http://139.59.20.72:3000/ (May Not Be Available After Sometime)
   
### What is this repository for? ###

* This Project Lets You Search Movies that had been filmed in San Francisco and draws Markers on the location with autocomplete feature.(there may not be marker for some of movies as i didn't got geolocation from google's geoCode API; because of ambigious location names in data source.May be in future it can be resolved)
* Version 1.0   

### Requirements ###

 * Node
 * MongoDB
 * Elastic Search (optional elastic code is commented)
 
### How do I get set up? ###

* Clone Repo.
* Run npm install 
* Run bower install commands (if not working try bower install --allow-root
* Change google Map Api Key (optional for sometime)  
* Run npm start  command and you are ready to go
* server will start on port 3000

### Technologies Used ###

   ### Backend ###
      *  Node.js
      *  Express.js
      *  MongDB
      *  ElasticSearch
      
   ### FrontEnd ###
      *  Angular.js
      *  Bootstrap
### Features/Challenges 
  * Fetching Data from DataSF Data Source 
  * Storing Data in MongoDB So that there is No issues in case of DataSF data Source is down.
    After Every 30 days Data Source is check for new Movies.   
  * Fetch GeoLocations from Google GeoCode Api.
  * Loading Data in ElasticSearch So that it will be Available for Search
  * Autocomplete and Marker
   


### Who do I talk to? ###

* feel free to raise issue
