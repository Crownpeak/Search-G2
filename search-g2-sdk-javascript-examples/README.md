<a href="http://www.crownpeak.com" target="_blank">![Crownpeak Logo](../images/logo/crownpeak-logo.png?raw=true "Crownpeak Logo")</a>

# Crownpeak Search G2 SDK Best Practice Examples

CrownPeak Search includes a fully supported Software Development Kit, enabling you to on-board quickly, and with less technical involvement than many search platforms.

* Makes implementation simple.
* Wraps-up the standard Lucene features offed by Search G2.
* Provided in both JavaScript & .NET versions.
* JavaScript version is available via the Crownpeak CDN.
* Minified version available at production-time.
* Versions maintained by Crownpeak.
* Keep version numbers for backwards compatibility.

We provide a few examples of the use of the Crownpeak Search G2 SDK, using different techologies for simple set-up:

* Using KnockoutJS: [Live Demo](http://htmlpreview.github.io/?https://github.com/Crownpeak/search-g2/blob/master/search-g2-sdk-javascript-examples/knockoutjs-search-g2-sdk-javascript-example.html) - [Source](./knockoutjs-search-g2-sdk-javascript-example.html)
* Using Plain Javscript: [Live Demo](http://htmlpreview.github.io/?https://github.com/Crownpeak/search-g2/blob/master/search-g2-sdk-javascript-examples/plainjs-search-g2-sdk-javascript-example.html) - [Source](./plainjs-search-g2-sdk-javascript-example.html)

We also provide a few examples of the use of the Crownpeak Search G2 SDK, for more advanced use-cases:

* Keyword Search example: [Live Demo](http://htmlpreview.github.io/?https://github.com/Crownpeak/search-g2/blob/master/search-g2-sdk-javascript-examples/advanced/knockoutjs-search-g2-sdk-javascript-keyword-example-advanced.html) - [Source](./advanced/knockoutjs-search-g2-sdk-javascript-keyword-example-advanced.html)
* Geospatial Search example: [Live Demo](http://htmlpreview.github.io/?https://github.com/Crownpeak/search-g2/blob/master/search-g2-sdk-javascript-examples/advanced/knockoutjs-search-g2-sdk-javascript-geospatial-example-advanced.html) - [Source](./advanced/knockoutjs-search-g2-sdk-javascript-geospatial-example-advanced.html)
* Product Search example: [Live Demo](http://htmlpreview.github.io/?https://github.com/Crownpeak/search-g2/blob/master/search-g2-sdk-javascript-examples/advanced/knockoutjs-search-g2-sdk-javascript-products-example-advanced.html) - [Source](./advanced/knockoutjs-search-g2-sdk-javascript-products-example-advanced.html)

***

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

***

## Disclaimer

THIS SITE IS EXPERIMENTAL AND MAY BE REMOVED AT ANY TIME.

THIS SOFTWARE IS PROVIDED "AS-IS," WITHOUT ANY EXPRESS OR IMPLIED WARRANTY.

IN NO EVENT SHALL CROWNPEAK TECHNOLOGY BE HELD LIABLE FOR ANY DAMAGES ARISING FROM THE USE OF THE SOFTWARE.

THIS SOFTWARE IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL, BUT WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS (INCLUDING BOTH CROWN PEAK TECHNOLOGY AND THE VARIOUS THIRD PARTY COPYRIGHT HOLDERS PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU, THE USER. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF SUCH HOLDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.