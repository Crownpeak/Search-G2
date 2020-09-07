<a href="http://www.crownpeak.com" target="_blank">![Crownpeak Logo](images/logo/crownpeak-logo.png?raw=true "Crownpeak Logo")</a>

# Crownpeak Search G2 Best Practice Examples

Crownpeak's Search platform is a highly-scalable, high-performance, enterprise-grade indexing & query platform, based upon the Apache Lucene Software Library & Apache SolrCloud. Crownpeak Search is available to all customers within the Crownpeak subscription at no additional cost.


## Benefits of Crownpeak Search G2

* **Fully Managed** - Like the core Content Management, Testing/Targeting/Personalization & Digital Quality Management platforms, Crownpeak Search is fully managed by the Crownpeak team. This means that you don't need to worry about availability, scalability or management. Crownpeak Search benefits from the sale SLA uptime guarantees as all areas of the Crownpeak portfolio.
* **Enterprise-Grade** - No matter what your data indexing & query requirements, Crownpeak Search ensures the performance, flexibility & security that you would expect from an enterprise-grade platform.
* **Hyper-Availability** - Like all other Crownpeak portfolio services, Crownpeak Search is designed to be hyper-available. Crownpeak's team of talented engineers ensure that the highest-levels of available are ensured, using techniques such as automatic sharding & replication of your data, as well as active processing of your data across multiple datacenters.
* **Open Standards** - Apache Lucene is the globally recognized open standard for enterprise search design & execution. Crownpeak Search implements The Apache Lucene Software Library & Apache Solr at its core to ensure that platform adoption is simple across all customers.
* **Global Support** - With support for any worldwide language, including single, double or multi-byte (UTF-8) character sets, Crownpeak Search will fulfil all of your global search platform requirements.
* **Auto Language Recognition** - In addition to support for any worldwide language, Crownpeak Search also includes automatic language detection capabilities for over 30 worldwide languages. Automatic language detection allows customers to implement stemming, spell-checking & suggestion capabilities very simply.
* **Spatial / Geospatial** - Crownpeak Search is fully spatial / geospatial aware, enabling customers to implement geographic enriched search features, such as 'Find an Office' or by ensuring that geographically relevant content is presented to your customer.
* **Public & Private Content** - Customers want to be able to quickly find content that is relevant to them. Why should this be restricted only to content that is publicly available, making the post-login experience less rewarding? Crownpeak Search fully supports indexing & query of content, regardless of whether it is public or private in nature.
* **Realtime Indexing** - Crownpeak Search is directly connected to the core Content Management platform, enabling Realtime Indexing of content at publish time - ensuring that the most recent content is always presented to your customer. Realtime Indexing also enables the publication of page-based content to Crownpeak Search, enabling search to play a core part in the navigational experience of your customer to enhance their experience.
* **Regular & Polite Crawling** - In addition to Realtime Indexing, Crownpeak Search fully supports regular crawling of your website (multiple times per day). Website crawling can help you to provide the best possible search experience across all customer touch-points, by indexing content that is located elsewhere in your organization, yet still relevant to the customer, creating a more rounded experience. Crownpeak Search also respects any rules that you deploy within your robots.txt file, meaning that you have full control over what content is crawled, and how often.
_Note: Website crawling is only available in use-cases where required content is not stored within the Crownpeak CMS._
* **Standards-Based API** - We know that your teams need to work with standards-based APIs, to ensure that they can do their jobs quickly and efficiently. Crownpeak Search implements a RESTful API for querying, and returns results in JSON or XML, depending on your requirements. This makes it perfect for powering powerful applications, across any channel or device without additional development effort.
* **Search G2 SDK** - Crownpeak Search includes a fully supported Software Development Kit, enabling you to on-board quickly, and with less technical involvement than many search platforms.

***

## Wildcard Schema (Schemaless Design)

In order to enable customers & partners to use Crownpeak Search for many use-cases across portfolio applications, Crownpeak has created a data schema that enables flexibility of data storage across multiple data-types.

Where custom data is to be stored, the field prefix "custom_{type}_{fieldname}" can be used, as follows:

```
* custom_i_{{fieldname}} - Integer (e.g. custom_i_myintegerfieldname);
* custom_s_{{fieldname}} - String (e.g. custom_s_mystringfieldname) - String fields are not tokenized, meaning you can search for exact matches only (good for filtering). Limited to 32Kb;
* custom_l_{{fieldname}} - Long (e.g. custom_l_mylongfieldname);
* custom_t_{{fieldname}} - Text (e.g. custom_t_mytextfieldname) - Text fields are tokenized, enabling you to use search within them to return values;
* custom_b_{{fieldname}} - Boolean (e.g. custom_b_mybooleanfieldname);
* custom_f_{{fieldname}} - Float (e.g. custom_f_myfloatfieldname);
* custom_d_{{fieldname}} - Double (e.g. custom_d_mydoublefieldname);
* custom_dt_{{fieldname}} - Date & time (e.g. custom_dt_mydatetimefieldname) - Date & time fields require a specific format. See [https://cwiki.apache.org/confluence/display/solr/Working+with+Dates](https://cwiki.apache.org/confluence/display/solr/Working+with+Dates) for more information;
* custom_p_{{fieldname}} - Location (e.g. custom_p_mylocationfieldname) - Location fields require a specific format. See [https://wiki.apache.org/solr/SpatialSearch](https://wiki.apache.org/solr/SpatialSearch) for more information;
* custom_c_{{fieldname}} - Currency (e.g. custom_c_mycurrencyfieldname).
```

By default, all fields contain single values, however, the following fields can store multiple values (arrays) if desired:

```
* custom_is_{{fieldname}} - Multi-valued integer field (e.g. custom_is_mymultivaluedintegerfieldname);
* custom_ss_{{fieldname}} - Multi-valued string field (e.g. custom_ss_mymultivaluedstringfieldname). Limited to 32Kb per entity;
* custom_ls_{{fieldname}} - Multi-valued long field (e.g. custom_ls_mymultivaluedlongfieldname);
* custom_txt_{{fieldname}} - Multi-valued text field (e.g. custom_txt_mymultivaluedtextfieldname);
* custom_bs_{{fieldname}} - Multi-valued boolean field (e.g. custom_bs_mymultivaluedbooleanfieldname);
* custom_fs_{{fieldname}} - Multi-valued fload field (e.g. custom_fs_mymultivaluedfloatfieldname);
* custom_ds_{{fieldname}} - Multi-valued double field (e.g. custom_ds_mymultivaluedoublefieldname);
* custom_dts_{{fieldname}} - Multi-valued date & time field (e.g. custom_dts_mymultivalueddatetimefieldname).
```

***

## Private Content

Customers want to be able to quickly find content that is relevant to them. Why should this be restricted only to content that is publicly available, making the post-login experience less rewarding? Crownpeak Search fully supports indexing & query of content, regardless of whether it is public or private in nature.

* Enables protected content to be stored;
* Provides Search *behind* the login gate;
* Ensures pre-production content cannot be located by unauthorised users.

See [Crownpeak Search G2 Private Content Best Practice Examples](private-content-examples/README.md) for further information.

***

## Realtime Indexing

Crownpeak Search's Realtime Indexing provides a direct connection between the Crownpeak CMS & Crownpeak Search. This enables you to build Assets within the Crownpeak CMS for delivery directly to Crownpeak Search upon publication.

Realtime Indexing provides the following advantages:

* Time-critical publications where traditional website crawling is too infrequent for content updates.
* Storing and returning items that otherwise don't need pages that are published to the delivery environment (e.g. office locations when taking advantage of Crownpeak Search's geo-location capability).
* Indexing & querying protected content that cannot be deployed to the delivery environment for security reasons.
* Choosing not to use site crawling at all.

See [Crownpeak Search G2 Realtime Indexing Best Practice Examples](realtime-indexing-examples/README.md) for further information.

***

## Search G2 SDK

Crownpeak Search includes a fully supported Software Development Kit, enabling you to on-board quickly, and with less technical involvement than many search platforms.

* Makes implementation simple.
* Wraps-up the standard Lucene features offed by Search G2.
* Provided in both JavaScript & .NET versions.
* JavaScript version is avaialble via the Crownpeak CDN.
* Minified version available at production-time.
* Versions maintained by Crownpeak.
* Keep version numbers for backwards compatibility.

See [Crownpeak Search G2 SDK Best Practice Examples](search-g2-sdk-javascript-examples/README.md) for further information.

***

## Search G2 Custom Endpoints

Crownpeak Search provides the option to have access to a secure, hosted Solr collection. See [Crownpeak Search G2 Custom Endpoints Best Practice Examples](custom-endpoint-examples/README.md) for further information.

***

## Disclaimer

THIS SITE IS EXPERIMENTAL AND MAY BE REMOVED AT ANY TIME.

THIS SOFTWARE IS PROVIDED "AS-IS," WITHOUT ANY EXPRESS OR IMPLIED WARRANTY.

IN NO EVENT SHALL CROWNPEAK TECHNOLOGY BE HELD LIABLE FOR ANY DAMAGES ARISING FROM THE USE OF THE SOFTWARE.

THIS SOFTWARE IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL, BUT WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS (INCLUDING BOTH CROWN PEAK TECHNOLOGY AND THE VARIOUS THIRD PARTY COPYRIGHT HOLDERS PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU, THE USER. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF SUCH HOLDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
