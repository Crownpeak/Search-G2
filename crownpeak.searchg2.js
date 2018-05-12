/*!
// ------------------------------------------------------------------------
// (C) CROWNPEAK TECHNOLOGY.
// ------------------------------------------------------------------------

// THIS SOFTWARE IS PROVIDED "AS-IS," WITHOUT ANY EXPRESS OR IMPLIED WARRANTY. 

// IN NO EVENT SHALL CROWNPEAK TECHNOLOGY BE HELD LIABLE FOR ANY DAMAGES ARISING FROM THE USE OF THE SOFTWARE.

// THIS SOFTWARE IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL, BUT WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. 
// THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS (INCLUDING BOTH CROWN PEAK TECHNOLOGY 
// AND THE VARIOUS THIRD PARTY COPYRIGHT HOLDERS PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, 
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU, THE USER. 
// SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING 
// WILL ANY COPYRIGHT HOLDER, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE 
// (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER PROGRAMS),
// EVEN IF SUCH HOLDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
// Version: 1.0.2
*/

function CrownPeakSearch(options) {

	var self = this;

	// Default configuration for properties
	var protocol = location.protocol == "file:" ? "http:" : location.protocol;
	/* Search proxy allows all queries to be sent via a proxy url - for security reasons
		 * Search proxy supports the following macros
		 * %%PROTOCOL%% - "https:" if this script was loaded via https, or "http:" if not
		 * %%COLLECTION%% - the collection being requested
		 * %%HANDLER%% - the handler being used
		 * %%URL%% - the entire url for the search
		 * %%URLENCODED%% - the entire url for the search, URI encoded
		 * Leave the proxy blank (or null, or undefined, etc.) if you don't want to use one
		 */
	var _searchProxy = "";
	/* Endpoint supports the following macros
	 * %%PROTOCOL%% - "https:" if this script was loaded via https, or "http:" if not
	 * %%COLLECTION%% - the collection being requested
	 * %%HANDLER%% - the handler being used
	 * %%QUERY%% - the querystring extension (do not include the "?")
	 */
	var _endpoint = "%%PROTOCOL%%//searchg2.crownpeak.net/%%COLLECTION%%/%%HANDLER%%?%%QUERY%%";
	var _maxRows = 200; // Don't let the user specify more than this number of results
	var _rows = 10;
	var _collection = "www.crownpeak.com";
	var _params = "";
	var _facets = [];
	var _maxFacets = 5;
	var _sort = [];
	var _spellcheck = false;
	var _highlight = false;
	var _highlightSeparator = "...";
	var _resultProxy = "";
	var _language = "";
	var _handler = "select";
	var _queryText = "";
	var _timeout = 5000;
	var _geo = null;

	parseArguments(options);

	// Fill for missing console.log for oldIE
	if (typeof console === "undefined") console = { log: function() { } }
	else if (!console.log) { console.log = function () { }; }

	function parseArguments(options) {
		if (options) {
			if (typeof options === "string") {
				// Single string is collection
				_collection = options;
			} else {
				// Otherwise look for properties on the thing they passed in
				if (options.collection) _collection = options.collection;
				if (options.endpoint) _endpoint = options.endpoint;
				if (options.facets) _facets = options.facets;
				if (options.handler) _handler = options.handler;
				if (options.highlight || options.highlight == false) _highlight = options.highlight;
				if (options.highlightSeparator) _highlightSeparator = options.highlightSeparator;
				if (options.language) _language = options.language;
				if (options.maxFacets || options.maxfacets == 0) _maxFacets = options.maxFacets;
				if (options.parameters) _params = options.parameters;
				if (options.resultProxy) _resultProxy = options.resultProxy;
				if (options.rows || options.rows == 0) _rows = options.rows;
				if (options.searchProxy) _searchProxy = options.searchProxy;
				if (options.sort) _sort = options.sort;
				if (options.spellcheck || options.spellcheck == false) _spellcheck = options.spellcheck;
				if (options.timeout || options.timeout == 0) _timeout = options.timeout;
			}
		}
	}

	/// <summary>
	/// Extend the document that matches this id with some extra properties
	/// </summary>
	function extendDoc(docs, id, props) {
		for (var i = 0, len = docs.length; i < len; i++) {
			var doc = docs[i];
			if (doc.id === id) {
				// Copy the properties over to the document
				var keys = Object.keys(props);
				for (var k = 0, lenK = keys.length; k < lenK; k++) {
					var key = keys[k];
					doc[key] = props[key];
				}
				break;
			}
		}
	}

	/// <summary>
	/// Copy some properties from the highlighting object into the response documents
	/// </summary>
	function copyHighlights(data) {
		// Copy the highlights into the response model
		var highlights = data.highlighting;
		var ids = Object.keys(highlights);

		// Loop through each document that has highlights
		for (var i = 0, len = ids.length; i < len; i++) {
			var id = ids[i];
			var hh = highlights[id];
			var fields = Object.keys(hh);
			// Create an object that we'll use to extend the response document
			var o = {};

			var lenF = fields.length;
			if (lenF > 0) {
				// Loop through each field within the document
				for (var j = 0; j < lenF; j++) {
					// Make a new property - e.g. title_hl - with highlights
					var fieldName = fields[j];
					o[fieldName + "_hl"] = _highlightSeparator + hh[fieldName].join(_highlightSeparator) + _highlightSeparator;
				}

				// Copy these new properties to the document that has this id
				extendDoc(data.response.docs, id, o);
			}
		}
	}

	/// <summary>
	/// Clean the types property to make it easier to use
	/// </summary>
	function cleanTypes(data) {
		if (data.response && data.response.docs && data.response.docs.length) {
			var docs = data.response.docs;
			for (var i = 0, len = docs.length; i < len; i++) {
				var t = docs[i].type;
				if (t && t.indexOf && t.indexOf("/") >= 0) {
					docs[i].type_short = t.split("/")[1];
				}
			}
		}
	}

	/// <summary>
	/// Clean the suggestions collection to make it easier to use
	/// </summary>
	function cleanSuggestions(data) {
		if (data.spellcheck && data.spellcheck.suggestions && data.spellcheck.suggestions.length) {
			var len = data.spellcheck.suggestions.length;
			var suggestions = data.spellcheck.suggestions[len - 1].suggestion;
			if (suggestions.length) {
				var results = [];
				for (var i = 0, len = suggestions.length; i < len; i++) {
					results.push(suggestions[i]);
				}
				data.suggestions = results;
			}
		};
	}

	/// <summary>
	/// Add a proxy_url property to the result, for ease of analytics
	/// </summary>
	function addResultProxy(data) {
		if (_resultProxy && data.response && data.response.docs && data.response.docs.length) {
			var proxy = _resultProxy;
			if (proxy.indexOf("%%QUERY%%")) proxy = proxy.replace(/%%QUERY%%/g, encodeURIComponent(_queryText));
			var docs = data.response.docs;
			for (var i = 0, len = docs.length; i < len; i++) {
				docs[i].proxy_url = proxy.replace(/%%INDEX%%/g, i) + docs[i].url;
			}
		}
	}

	/// <summary>
	/// Add a pager property to make it easier to render one
	/// </summary>
	function addPager(data) {
		if (data && data.response && (data.response.start || data.response.start === 0)
			&& (data.response.numFound || data.response.numFound === 0)) {
			// Add a simple pager to the output - the user can customise it if they like
			data.pager = {
				page: data.response.start / _rows + 1,
				pages: [],
				total: Math.ceil(data.response.numFound / _rows)
			};
			if (_rows > 0) {
				// Simple pager just has one entry for each page
				for (var i = 0; i < data.response.numFound / _rows; i++) {
					data.pager.pages.push(i + 1);
				}
			}
		}
	}

	/// <summary>
	/// Add a score property to each result, normalized based on the highest score
	/// </summary>
	function addNormalizedScores(data) {
		if (data.response && data.response.maxScore && data.response.docs && data.response.docs.length) {
			var maxScore = data.response.maxScore || 1.0;
			var docs = data.response.docs;
			for (var i = 0, len = docs.length; i < len; i++) {
				docs[i].normalizedScore = docs[i].score / maxScore;
			}
		}
	}

	/// <summary>
	/// Add a didYouMean property to the main, to make suggestions easy to provide later
	/// </summary>
	function addDidYouMean(data) {
		if (data.spellcheck && data.spellcheck.suggestions && data.spellcheck.suggestions.length) {
			var didYouMean = [];
			// Results come in name,value pairs
			for (var i = 0, len = data.spellcheck.suggestions.length; i < len; i += 2) {
				var name = data.spellcheck.suggestions[i];
				var value = data.spellcheck.suggestions[i + 1];
				if (name == "collation") {
					// Collations also come in name,value pairs
					var query = "";
					var html = "";
					for (var j = 0, lenC = value.length; j < lenC; j += 2) {
						var cname = value[j];
						var cvalue = value[j + 1];
						if (cname == "collationQuery") {
							query = html = cvalue;
						}
						else if (cname == "hits") {
							html += " (" + cvalue + ")";
						}
						else if (cname == "misspellingsAndCorrections") {
							// Corrections also come in (what else) name,value pairs
							for (var k = 0, lenM = cvalue.length; k < lenM; k += 2) {
								var original = cvalue[k];
								var replacement = cvalue[k + 1];
								var re = new RegExp("\\b" + replacement + "\\b", "i");
								html = html.replace(re, "<em>" + replacement + "</em>");
							}
						}
					}
					// Add this to our collection
					didYouMean.push({ query: query, display: html });
				}
			}
			if (didYouMean.length > 0) {
				// Add this to our output
				data.didYouMean = didYouMean;
			}
		}
	}

	/// <summary>
	/// Get the full url to be used to execute a query against Search G2
	/// </summary>
	function getSearchUrl(collection, handler, query) {
		var url = _endpoint
			.replace(/%%PROTOCOL%%/ig, protocol)
			.replace(/%%COLLECTION%%/ig, _collection)
			.replace(/%%HANDLER%%/ig, handler)
			.replace(/%%QUERY%%/ig, query);

		if (_searchProxy && _searchProxy.replace) {
			return _searchProxy
				.replace(/%%PROTOCOL%%/ig, protocol)
				.replace(/%%COLLECTION%%/ig, _collection)
				.replace(/%%HANDLER%%/ig, handler)
				.replace(/%%URL%%/ig, url)
				.replace(/%%URLENCODED%%/ig, encodeURIComponent(url));
		}

		return url;
	}

	/// <summary>
	/// Copy the Collations structure from Solr 6.1 format to Solr 4.6 format
	/// </summary>
	function copyCollations(data) {
		if (data && data.spellcheck && data.spellcheck.suggestions && data.spellcheck.collations) {
			for (var i = 0, len = data.spellcheck.collations.length; i < len; i++) {
				var item = data.spellcheck.collations[i];
				if (typeof item === "object" && item != null) {
					var newItem = [];
					for (var key in item) {
						if (item.hasOwnProperty(key)) {
							newItem.push(key);
							newItem.push(item[key]);
						}
					}
					data.spellcheck.suggestions.push(newItem);
				} else {
					data.spellcheck.suggestions.push(item);
				}
			}
		}
	}

	/// <summary>
	/// Execute the provided query against the configured url and collection
	/// </summary>
	function internalRawQuery(query, handler) {
		// We'll return the promise from this object later
		var dfd = new Deferred();

		handler = handler || _handler || "select";

		// Append our JSONP callback
		query += "&json.wrf=%%CALLBACK%%";

		var thisUrl = getSearchUrl(_collection, handler, query);

		console.log("Querying " + thisUrl.replace("&json.wrf=%%CALLBACK%%", ""));

		// Make a JSONP request to our Solr collection
		getUrl(thisUrl, _timeout)
			.done(function(data) {
				if (_highlight && data.highlighting) {
					copyHighlights(data);
				}

				if (handler == "suggest") {
					cleanSuggestions(data);
				}
				else {
					cleanTypes(data);
					addResultProxy(data);
					copyCollations(data);
					addDidYouMean(data);
					addNormalizedScores(data);
					addPager(data);
				}

				// Search complete - resolve the promise
				dfd.resolve(data);
			})
			.fail(function(status, url, error) { //jqXHR, textStatus, errorThrown) {
				dfd.reject(status, url, error);
			});

		// Return a promise that we'll resolve later when the search has completed
		return dfd.promise();
	}

	/// <summary>
	/// Build a query using the text and page number and execute it
	/// </summary>
	function internalQuery(text, page, filterQueries) {
		_queryText = text;
		var data = "q=" + encodeURIComponent(text)
			+ (!text ? "&q.alt=*" : "")
			+ "&echoParams=explicit" // change to none when finished debugging
			+ "&fl=*,score" // we want the score field in order to be able to rate results
			+ "&defType=edismax" // handles more complex queries and gracefully fails if it doesn't understand
			+ "&wt=json&start=" + page * _rows + "&rows=" + Math.min(_rows, _maxRows)
			+ (_language !== "" ? "&fq=language:" + _language : "")
			+ (_spellcheck ? "&spellcheck=true&spellcheck.collate=true&spellcheck.collateExtendedResults=true" : "")
			+ (filterQueries && filterQueries.length > 0 ? "&fq=" + filterQueries.join("&fq=") : "")
			+ (_facets.length > 0 ? "&facet=true&facet.mincount=1&facet.field=" + _facets.join("&facet.field=") : "")
			+ (_facets.length > 0 && _maxFacets > 0 ? "&facet.limit=" + _maxFacets : "")
			+ (_sort.length > 0 ? "&sort=" + _sort.join(",") : "")
			+ (_highlight ? "&hl=true&hl.fl=*&hl.snippets=3&hl.simple.pre=" + escape("<b>") + "&hl.simple.post=" + escape("</b>") + "&f.title.hl.fragsize=50000&f.url.hl.fragsize=50000" : "");

		if (_geo) {
			var geoParams = [];
			if (_geo.location) {
				if (typeof _geo.location === "string")
					geoParams.push("pt=" + _geo.location);
				else
					geoParams.push("pt=" + (_geo.location.latitude || _geo.location.lat || 0) + "," +
						(_geo.location.longitude || _geo.location.lon || 0));
			} else {
				geoParams.push("pt=0,0");
			}
			// It won't work without a field
			geoParams.push("sfield=" + (_geo.field || "custom_p_location"));
			// If they didn't already sort by something else, assume they want by ascending distance
			if (_sort.length == 0) geoParams.push("sort=geodist()%20asc");
			// What do they want it called on the output?
			geoParams.push("fl=" + encodeURI(_geo.outputfield || "_dist_") + ":geodist()");
			// Filter results by by range
			if (_geo.range) {
				var range = _geo.range;
				if (typeof _geo.range != "number" && _geo.range.distance) {
					range = _geo.range.distance;
					var unit = _geo.range.units || _geo.range.unit;
					if (unit && unit.toLowerCase) {
						switch (unit.toLowerCase()) {
							case "mile": case "miles":
								range *= 1.609344;
								break;
							case "metre": case "metres": case "meter": case "meters":
								range /= 1000;
								break;
							default: // KM = nothing to do
						}
					}
				}
				if (!isNaN(range)) geoParams.push("fq={!geofilt%20d%3d" + (range) + "}");
			}

			data += "&" + geoParams.join("&");
		}

		// If they provided additional parameters, merge them into our set
		if (_params) data = mergeParameters(data, _params.replace(/^[&]/, ""));

		return internalRawQuery(data);
	}

	/// <summary>
	/// Merge together two sets of parameters and return the result, with s2 taking precendence
	/// </summary>
	function mergeParameters(s1, s2) {
		var PARAMS_TO_IGNORE = ",fl,fq,hl.fl,"; // NOTE: keep the leading/trailing commas
		var result = [];

		// Immediate exit conditions
		if (!s1) return s2;
		if (!s2) return s1;

		var s1Items = s1.split("&"), s2Items = s2.split("&");

		for (var i = 0, len = s1Items.length; i < len; i++) {
			var item = s1Items[i].split("=");
			var key = item[0], value = item[1];
			// Is this in string 2?
			var s2Index = indexOfKey(s2Items, key);
			if (s2Index >= 0) {
				// Yes, so process it
				var item2 = s2Items[s2Index].split("=");
				var key2 = item2[0], value2 = item2[1];
				if (PARAMS_TO_IGNORE.indexOf("," + key + ",") >= 0) {
					// push key 1
					result.push(key + "=" + value);
				}
				// Push key 2
				result.push(key2 + "=" + value2);
				// Remove this item from string 2
				s2Items.splice(s2Index, 1);
			} else {
				// No, so just append it
				result.push(key + "=" + value);
			}
		}

		// Append anything left in string 2
		result = result.concat(s2Items);

		return result.join("&");
	}

	/// <summary>
	/// Find the index of a key in an array of key=value pairs
	/// </summary>
	function indexOfKey(array, key) {
		if (!array || !array.length) return -1;
		for (var i = 0, len = array.length; i < len; i++) {
			if (array[i].split("=")[0] === key) return i;
		}
		return -1;
	}


	/// <summary>
	/// Build a suggest query using the text and execute it
	/// </summary>
	function internalAutocompleteQuery(text) {
		_queryText = text;
		var data = "q=" + encodeURIComponent(text)
			+ "&wt=json&spellcheck.collate=false"
			+ (_params ? "&" + _params.replace(/^[&]/, "") : "");

		return internalRawQuery(data, "suggest");
	}

	function getUrl(url, timeout) {

		var deferred = new Deferred();

		function addEvent(element, eventName, fn) {
			if (element.addEventListener)
				element.addEventListener(eventName, fn);
			else if (element.attachEvent)
				element.attachEvent("on" + eventName, function () { fn.call(element); });
		}

		function tidytimer() {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
		}

		function tidyscript() {
			window[cb] = overwritten;
			if (script) {
				script.parentElement.removeChild(script);
				script = null;
			}
		}

		try {
			var cb = "searchg2_" + Math.random().toString().substr(2);
			var overwritten = window[cb];
			var timer = null;

			if (timeout && !isNaN(timeout)) {
				timer = setTimeout(function () {
					try {
						tidytimer();
					}
					catch (ex) {
						// Ignore errors here
					}
					finally {
						deferred.reject("timeout", url);
					}
				}, timeout);
			}

			window[cb] = function (data) {
				tidytimer();
				deferred.resolve(data, url);
			}

			var script = document.createElement("script");

			var loadOrError = function (event) {
				tidytimer();
				tidyscript();
				if (event.type === "error") {
					deferred.reject("error", url);
				}
			}

			addEvent(script, "load", loadOrError);
			addEvent(script, "error", loadOrError);

			script.src = url.replace(/%%CALLBACK%%|%25%25CALLBACK%25%25/ig, cb);
			document.getElementsByTagName("head")[0].appendChild(script);
		} catch (e) {
			deferred.reject(url, "error", e);
		}

		return deferred.promise();
	}

	function Deferred() {
		var deferred = {
			args: null,
			state: "pending",
			doneList: [],
			failList: [],
			alwaysList: []
		},
			trigger = function (list, args) {
				for (var i = 0, len = list.length; i < len; i++) {
					list[i].apply(list[i], args);
				}
			};

		return {
			promise: function () {
				return {
					status: function () {
						return state;
					},
					done: function (fn) {
						if (deferred.state == "resolved") {
							fn.apply(fn, deferred.args);
						} else {
							deferred.doneList.push(fn);
						}
						return this;
					},
					fail: function (fn) {
						if (deferred.state == "rejected") {
							fn.apply(fn, deferred.args);
						} else {
							deferred.failList.push(fn);
						}
						return this;
					},
					always: function (fn) {
						if (deferred.state == "rejected" || deferred.state == "resolved") {
							fn.apply(fn, deferred.args);
						} else {
							deferred.alwaysList.push(fn);
						}
						return this;
					}
				}
			},
			resolve: function () {
				if (deferred.state === "pending") {
					deferred.state = "resolved";
					deferred.args = arguments;
					trigger(deferred.doneList, arguments);
					trigger(deferred.alwaysList, arguments);
				}
			},
			reject: function () {
				if (deferred.state === "pending") {
					deferred.state = "rejected";
					deferred.args = arguments;
					trigger(deferred.failList, arguments);
					trigger(deferred.alwaysList, arguments);
				}
			}
		}
	}

	// Getters and setters would be nice, but in the meantime...
	this.rows = function (value) { if (value !== undefined) _rows = value; return _rows; };
	this.collection = function (value) { if (value !== undefined) _collection = value; return _collection; };
	this.endpoint = function (value) { if (value !== undefined) _endpoint = value; return _endpoint; };
	this.facets = function (value) { if (value !== undefined) _facets = (typeof value === "string" ? [value] : value); return _facets; };
	this.maxFacets = function (value) { if (value !== undefined) _maxFacets = value; return _maxFacets; };
	this.handler = function (value) { if (value !== undefined) _handler = value; return _handler; };
	this.highlight = function (value) { if (value !== undefined) _highlight = value; return _highlight; };
	this.highlightSeparator = function (value) { if (value !== undefined) _highlightSeparator = value; return _highlightSeparator; };
	this.language = function (value) { if (value !== undefined) _language = value; return _language; };
	this.searchProxy = function (value) { if (value !== undefined) _searchProxy = value; return _searchProxy; };
	this.spellcheck = function (value) { if (value !== undefined) _spellcheck = value; return _spellcheck; };
	this.sort = function (value) { if (value !== undefined) _sort = (typeof value === "string" ? [value] : value); return _sort; };
	this.timeout = function (value) { if (value !== undefined) _timeout = value; return _timeout; };
	this.parameters = function (value) { if (value !== undefined) _params = value; return _params; };
	this.resultProxy = function (value) { if (value !== undefined) _resultProxy = value; return _resultProxy; };
	this.geo = function (value) { if (value !== undefined) _geo = value; return _geo; };

	/// <summary>
	/// Run a query against the configured CrownPeakSearch object
	/// </summary>
	/// <param name="text">The query text. See https://wiki.apache.org/solr/SolrQuerySyntax for more information</param>
	/// <param name="page">The page number (starting at 1) of results that you wish to retrieve</param>
	/// <param name="filterQueries">An array of strings in the format "field:value" to apply to the query</param>
	/// <returns>A Deferred object that will be resolved when the query is complete</returns>
	this.query = function(text, page, filterQueries) {
		if (!page) page = 1;
		return internalQuery(text, page - 1, filterQueries);
	};

	/// <summary>
	/// Run an autocomplete (suggest) query against the configured CrownPeakSearch object
	/// </summary>
	/// <param name="text">The query text. See https://wiki.apache.org/solr/SolrQuerySyntax for more information</param>
	/// <returns>A Deferred object that will be resolved when the query is complete</returns>
	this.autocomplete = function (text) {
		return internalAutocompleteQuery(text);
	};

	/// <summary>
	/// Run a raw query against the Solr instance that is configured in the CrownPeakSearch object
	/// </summary>
	/// <param name="query">The query, sent in an HTTP GET request. See http://lucene.apache.org/solr/3_6_2/doc-files/tutorial.html for more information</param>
	/// <returns>A Deferred object that will be resolved when the query is complete</returns>
	this.raw = function(query) {
		return internalRawQuery(query);
	};
}

// Old IE support
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
	Object.keys = (function () {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

		return function (obj) {
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}