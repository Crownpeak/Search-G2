_Note: By default, Custom Endpoints are not available unless explicitly requested by the client._

## Crownpeak SearchG2 Custom Endpoint Best Practice Examples

Customers may want to have total control over the way that their data is indexed by Solr. For this purpose Crownpeak provides SearchG2 Custom Endpoints.

***

## Crownpeak Search Custom Endpoint Content Architecture

Crownpeak Search G2 Custom Endpoints work by restricting access to an entire Crownpeak Search G2 Collection. In order to interact with Crownpeak Search G2 Custom Endpoints, a request **MUST** be made:

* Using HTTPS (i.e. https://searchg2.crownpeak.net/{crownpeak\_searchg2\_collection\_name}/{query};
* Using TLS1.2;
* Supplying both the correct client username and password to the request.

If any of the above conditions are not met, the request will be met with an "Access Denied" page, and 403 (Forbidden) response code.

***
## Examples

As SearchG2 Custom Endpoints grant the user access to the full range of Solr functionality, a detailed introduction is beyond the scope of this document. In-depth documentation is available at the official [Solr website](https://lucene.apache.org/Solr/guide/6.6/) including a [Getting Started](https://lucene.apache.org/Solr/guide/6_6/getting-started.html#getting-started) guide.

[API Clients](https://lucene.apache.org/solr/guide/6_6/client-apis.html) are available for use with many of the most popular languages including C#, Java and Python.

However, if you are using JavaScript then requests can be send to Solr using the standard XMLHttpRequest (XHR) object, and the request easily-parsed as JSON by adding 'wt=json' to the request URL.

In order to keep these examples very simple, we're going to use the standard command-line utility of cURL

## Adding a single document
    curl -X POST -H 'Content-Type: application/json' -u username:password 'https://searchg2.crownpeak.net/{crownpeak\_searchg2\_collection\_name}/update' --data-binary '
    {
        "id": "1",
        "title": "Doc 1"
    }'

## Adding multiple documents
    curl -X POST -H 'Content-Type: application/json' -u username:password 'https://searchg2.crownpeak.net/{crownpeak\_searchg2\_collection\_name}/update' --data-binary '
    {
        "add": {
            "doc": {
                "id": "1",
                "title": "Doc 1"
            }
        },
        "add": {
            "doc": {
                "id": "2",
                "title": "Doc 2"
            }
        },
        "commit": {}
    }'
 
***
_Note: standard Solr options that enable the user to change the functionality of both 'optimize' and 'commit'-type (e.g. 'commit', 'commitWithin' and so on) commands are ignored by SearchG2 Custom Endpoints, and system defaults are used instead)._

_An update command containing:
    `{ ..
        "commitWithin": 5000','"optimize": {"waitSearcher: false"}' ..
    }` will be treated the same as `{ "commit": {} }`_

## Deleting documents 
Deletes are very similar to 

***
## Disclaimer

THIS SITE IS EXPERIMENTAL AND MAY BE REMOVED AT ANY TIME.

THIS SOFTWARE IS PROVIDED "AS-IS," WITHOUT ANY EXPRESS OR IMPLIED WARRANTY.

IN NO EVENT SHALL CROWNPEAK TECHNOLOGY BE HELD LIABLE FOR ANY DAMAGES ARISING FROM THE USE OF THE SOFTWARE.

THIS SOFTWARE IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL, BUT WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS (INCLUDING BOTH CROWN PEAK TECHNOLOGY AND THE VARIOUS THIRD PARTY COPYRIGHT HOLDERS PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU, THE USER. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF SUCH HOLDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
