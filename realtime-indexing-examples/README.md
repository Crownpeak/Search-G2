# Crownpeak Search G2 Realtime Indexing Best Practice Examples

CrownPeak Search's Realtime Indexing enhances the existing search platform by providing a direct connection between the CrownPeak CMS & CrownPeak Search. With this enhancement, customers & partners can build Assets within the CrownPeak CMS for delivery directly to CrownPeak Search upon publication.

A number of use-cases where Realtime Indexing would prove advantageous:

* Time-critical publications where website crawling is too infrequent for CrownPeak Search update.
* Storing and returning items that otherwise don't need pages that are published to the delivery environment (e.g. office locations when taking advantage of CrownPeak Search's geo-location capability).
* Indexing & querying protected content that cannot be deployed to the delivery environment for security reasons.
* Choosing not to use site crawling at all.

***

## Configuring Crownpeak Search G2 Realtime Indexing

In order to use Search G2 Realtime Indexing, the Search G2 CMS Connector must be enabled. This connector links the CMS to each Search G2 Collection that you manage. Connectors must be configured initially by Crownpeak Support. Raise a ticket, or send an email to support@crownpeak.com.

Once the Search G2 CMS Connector has been configured, you need to update your CMS Publishing Packages to select which Search G2 CMS Connector to use for deployment (see image below):

![searchg2-realtimeindexing-publishingpackage-example.png](../images/examples/searchg2-realtimeindexing-publishingpackage-example.png?raw=true "searchg2-realtimeindexing-publishingpackage-example.png")

Finally, configure Search G2 CMS Realtime Indexing Templates to define which data to publish to Search G2 during the publish operation.

### Search G2 CMS Realtime Indexing CMS Templates

There are 3 Templates that you can configure in order to use Search G2 Realtime Indexing:

* search_g2_insert.aspx - This is fired first time an Asset is published;
* search_g2_update.aspx - This is fired for subsequent updates to an existing Asset;
* search_g2_delete.aspx - This is fired for delete request for an existing Asset.

Example of a Search G2 CMS Realtime Indexing Insert / Update Template:

```
//set-up the CrownPeak.CMSAPI.Services.SearchG2JsonParams object for document insert/update to CrownPeak Search
var doc = new SearchG2JsonParams
{
    /*Id = asset.Id.ToString(), //note that this is not required if the value asset.Id.ToString() is to be used as the document identifier in CrownPeak Search*/
    Operation = SearchG2JsonParams.OperationType.Create, //or SearchG2JsonParams.OperationType.Update
    Overwrite = true //if a document exists with this Id, overwrite it
};
 
doc.Add("custom_s_language", "language"); //custom string field "language", takes value from asset["language"]
doc.Add("custom_s_country", "country");
doc.Add("custom_s_product", "product");
doc.Add("title", "title");
doc.Add("content", "content");
doc.Add("type", "type");
doc.AddFixed("contentLength", asset.Raw["content"].Length.ToString()); //standard CrownPeak Search field "contentLength", taking value from asset.Raw["content"].Length.ToString()
doc.AddFixed("tstamp", DateTime.UtcNow.ToString("O")); //standard CrownPeak Search field "stamp", taking value from DateTime.UtcNow.ToString("O")
doc.Add("date", AssetPropertyNames.ModifiedDate);
doc.Add("lastModified", AssetPropertyNames.ModifiedDate);
 
//add the SearchG2JsonParams document to context.JsonParams collection for insert/update to CrownPeak Search.
context.JsonParams.Add(doc);
```

Example of a Search G2 CMS Realtime Indexing Delete Template:

```
//set-up the CrownPeak.CMSAPI.Services.SearchG2JsonParams object for document delete from CrownPeak Search
var doc = new SearchG2JsonParams
{
    /*Id = asset.Id.ToString(), //note that this is not required if the value asset.Id.ToString() is to be used as the document identifier in CrownPeak Search*/
    Operation = SearchG2JsonParams.OperationType.Delete
};
 
//add the SearchG2JsonParams document to context.JsonParams collection for delete from CrownPeak Search.
context.JsonParams.Add(doc);
```

### Logging Search G2 Realtime Indexing Actions

A record is added to the System Log under 'Custom' in the Action filter when an asset is sent for Realtime Indexing.  This log can be viewed under Reports > Audit > System (see below):

![searchg2-realtimeindexing-logging-example.png](../images/examples/searchg2-realtimeindexing-logging-example.png?raw=true "searchg2-realtimeindexing-logging-example.png")

***

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS-IS," WITHOUT ANY EXPRESS OR IMPLIED WARRANTY.

IN NO EVENT SHALL CROWNPEAK TECHNOLOGY BE HELD LIABLE FOR ANY DAMAGES ARISING FROM THE USE OF THE SOFTWARE.

THIS SOFTWARE IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL, BUT WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS (INCLUDING BOTH CROWN PEAK TECHNOLOGY AND THE VARIOUS THIRD PARTY COPYRIGHT HOLDERS PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU, THE USER. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF SUCH HOLDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.