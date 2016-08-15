# Crownpeak Search G2 SDK Best Practice Examples

CrownPeak Search includes a fully supported Software Development Kit, enabling you to on-board quickly, and with less technical involvement than many search platforms.

* Makes implementation simple.
* Wraps-up the standard Lucene features offed by Search G2.
* Provided in both JavaScript & .NET versions.
* JavaScript version is avaialble via the Crownpeak CDN.
* Minified version available at production-time.
* Versions maintained by Crownpeak.
* Keep version numbers for backwards compatibility.

We provide a few examples of the use of the Crownpeak Search G2 SDK, using different techologies:

* [KnockoutJS](./knockoutjs-search-g2-sdk-javascript-example.html)
* [Plain Javascript](./plainjs-search-g2-sdk-javascript-example.html)

## Creating A Simple Text-Based Search Page, Using Knockout JS

The following example shows you how to create a simple text-based search page, using Knocking JS & the Crownpeak Search G2 SDK. This assumes that you have an HTML page available for testing. This example can be run locally, without the need to deploy to the Crownpeak CMS.

### Add References to Crownpeak Search G2 SDK, KnockoutJS & JQuery

Within the head element of your page, include the following references:

```
<script src="https://searchg2-assets.crownpeak.net/crownpeak.searchg2-1.0.0.min.js"></script>
<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.1.min.js"></script>
<script src="https://ajax.aspnetcdn.com/ajax/knockout/knockout-3.1.0.js"></script>
```

### Configure Crownpeak Search G2 SDK Properties

Within a new script block in the body of the page, initialize the Search G2 SDK Properties:

```
<script>
	var cps = new CrownPeakSearch("www.crownpeak.com") // Change the Crownpeak Search G2 Collection name as required
	cps.facets(["title"]); // Include any fields that you wish to provide facets across (can be left blank if desired)
	cps.maxFacets(6); // The number of facets to return by default, if required
	cps.highlight(true); // Whether to turn on hit highlighting within content (surrounds hit results with <strong/> HTML tags)
	//cps.sort(["url desc"]); // Define whether you want a sort to be performed on the search results 
	cps.rows(5); // The number of rows to return by default
	cps.spellcheck(true); // Whether to enable spellcheck features
</script>
```

### Add Basic KnockoutJS Template

Add a basic KnockoutJS template to hold the results of our search query. Add this to the body element of the page, above the script block created earlier:

```
<!-- ko with: result -->
<div>
	<!-- ko if: response.docs && response.docs.length > 0 -->
	<div data-bind="foreach: response.docs">
		<div>
			<h4>
				<!-- ko ifnot: $root.ordinal -->
				<a data-bind="attr: { href: $data.url }, text: ($data.title) || '[No title]'"></a>
				<!-- /ko -->
			</h4>
		</div>
	</div>
	<!-- /ko -->
	<!-- ko if: !response.docs || response.docs.length <= 0 -->
	<p>Sorry, no results found.</p>
	<!-- /ko -->
</div>
<!-- /ko -->
```

### Add a Search Box & Button

Add a search box & button to the page, above the KnockoutJS template created earlier:

```
<div>
	<input type="text" name="keyword_search" data-bind="value:query" />
	<input type="button" value="Search" data-bind="click:search" />
</div>
```

### Build ViewModel & Search Method

Build the ViewModel and search method. Do this in the script block created earlier, below the Search G2 configuration code:

```
function ViewModel() {
	var self = this;
	self.query = ko.observable("");
	self.page = ko.observable(1);
	self.result = ko.observable(false);
	self.suggestions = ko.observableArray([]);
	self.filterQueries = ko.observableArray([]);
	self.search = function() {
		cps.query(self.query(), self.page(), self.filterQueries())
		.done(function(data) {
			self.result(data);
		});
	}
}
			
var vm = new ViewModel();
ko.applyBindings(vm);
```

### Run The Page

When you run the page, you will be presented with the search box and button. Enter a keyword (e.g. crown) and click the button to see your search results, delivered immediately from the www.crownpeak.com Search G2 Collection, via the SDK.

The entire source of this page is detailed below:

```
<html>
	<head>
		<script src="https://searchg2-assets.crownpeak.net/crownpeak.searchg2-1.0.0.min.js"></script>
		<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.1.min.js"></script>
		<script src="https://ajax.aspnetcdn.com/ajax/knockout/knockout-3.1.0.js"></script>
	</head>
	<body>
		<div>
			<input type="text" name="keyword_search" data-bind="value:query" />
			<input type="button" value="Search" data-bind="click:search" />
		</div>
		
		<!-- ko with: result -->
		<div>
			<!-- ko if: response.docs && response.docs.length > 0 -->
			<div data-bind="foreach: response.docs">
				<div>
					<h4>
						<!-- ko ifnot: $root.ordinal -->
						<a data-bind="attr: { href: $data.url }, text: ($data.title) || '[No title]'"></a>
						<!-- /ko -->
					</h4>
				</div>
			</div>
			<!-- /ko -->
			<!-- ko if: !response.docs || response.docs.length <= 0 -->
			<p>Sorry, no results found.</p>
			<!-- /ko -->
		</div>
		<!-- /ko -->
		
		<script>
			var cps = new CrownPeakSearch("www.crownpeak.com") // Change the Crownpeak Search G2 Collection name as required
			cps.facets(["title"]); // Include any fields that you wish to provide facets across (can be left blank if desired)
			cps.maxFacets(6); // The number of facets to return by default, if required
			cps.highlight(true); // Whether to turn on hit highlighting within content (surrounds hit results with <strong/> HTML tags)
			//cps.sort(["url desc"]); // Define whether you want a sort to be performed on the search results 
			cps.rows(5); // The number of rows to return by default
			cps.spellcheck(true); // Whether to enable spellcheck features
			
			function ViewModel() {
				var self = this;
				self.query = ko.observable("");
				self.page = ko.observable(1);
				self.result = ko.observable(false);
				self.suggestions = ko.observableArray([]);
				self.filterQueries = ko.observableArray([]);
				self.search = function() {
					cps.query(self.query(), self.page(), self.filterQueries())
					.done(function(data) {
						self.result(data);
					});
				}
			}
			
			var vm = new ViewModel();
			ko.applyBindings(vm);
		</script>
	</body>
</html>
```
