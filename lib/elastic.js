const elasticsearch = require('elasticsearch');
const _ = require('lodash');

/*
*  This Module Is simple interface to Elastic CLient
* **/
/** This Code I Inetentionally Wrote in Es6*/

class ElasticApp {
    /**
	 * Init elastic search client
     * @param host
     * @param port
     */
	constructor(host, port) {
		this.esClient = new elasticsearch.Client({
			host: host + ":" + port,
			log: 'error'
		});
	}

    /**
	 * Check Health Of the Cluster
     */
	checkClusterHealth() {
		return this.esClient.cluster.health({});
	}

    /**
	 * Get All Indicies in elastic Search
     * @param options
     */
	getIndices(options) {
		return this.esClient.cat.indices(options)
	}

    /**
	 * Create Index in elastic
     * @param name - name of the index to be created
     */
	createIndex(name) {
		return this.esClient.indices.create({
			index: name
		});
	}

    /**
	 * Delete Index from elastic
     * @param name - name of the index
     */
	deleteIndex(name) {
		return this.esClient.indices.delete({
			index: name
		});
	}

    /**
	 * Check If index Exists or not
     * @param name - name of the index
     */
	indexExists(name) {
		return this.esClient.indices.exists({
			index: name
		});
	}

    /**
	 * Count Number Of documents in an index
     * @param index - name of the index
     * @param type - type of index
     */
	countDocumentsInIndex(index, type) {
		return this.esClient.count({
			index: index,
			type: type
		});
	}

    /**
	 * Add single document in Elastic search
     * @param indexName
     * @param docId
     * @param docType
     * @param docBody
     */
	addDocument(indexName, docId, docType, docBody) {
		return this.esClient.index({
			index: indexName,
			id: docId,
			type: docType,
			body: docBody
		});
	}

    /**
	 * This Method Is used for Mapping (like creating Schema)
     * @param indexName
     * @param indexType
     * @param body
     * @returns {*}
     */
	indexMapping(indexName, indexType, body) {
		return this.esClient.indices.putMapping({
			index: indexName,
			type: indexType,
			body: body
		})
	}

    /**
	 * This Method fetches Schema Of the Index Passed
     * @param indexName
     * @param indexType
     * @param callback
     */
	fetchMapping(indexName, indexType, callback) {
		this.esClient.indices.getMapping({
			index: indexName,
			type: indexType
		}, function(error, result) {
			callback(error, result)
		})
	}

    /**
	 * Search based on index name and search Query
     * @param indexName
     * @param queryBody
     */
	search(indexName, queryBody) {
		return this.esClient.search({
			index: indexName,
			body: queryBody
		})
	}

    /**
	 * Formates the Data before bulk data will be stored in ElasticSearch
     * @param index
     * @param type
     * @param data
     * @returns {Promise}
     */
	bulkDataHandler(index, type, data) {
		return new Promise(function(resolve, reject) {
			let bulkBody = [];
			_.each(data, function(item) {
				bulkBody.push({
					index: {
						_index: index,
						_type: type,
						_id: item.movieId
					}
				});
				bulkBody.push(item);
			});
			resolve(bulkBody);
		})
	}

    /**
	 *  Imports Multiple Documents in Elastic Search
     * @param data
     * @returns {*}
     */
	bulkInserts(data) {
		return this.esClient.bulk({
			body: data
		});
	}

}

module.exports = ElasticApp;