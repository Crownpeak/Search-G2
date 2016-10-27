<a href="http://www.crownpeak.com" target="_blank">![Crownpeak Logo](../images/logo/crownpeak-logo.png?raw=true "Crownpeak Logo")</a>

# Crownpeak Search G2 Private Content Best Practice Examples

Customers want to be able to quickly find content that is relevant to them. Why should this be restricted only to content that is publicly available, making the post-login experience less rewarding? Crownpeak Search fully supports indexing & query of content, regardless of whether it is public or private in nature.

* Enables protected content to be stored;
* Provides Search *behind* the login gate;
* Ensures pre-production content cannot be located by unauthorised users.

_Note: By default, Crownpeak Search G2 Collections are publicly available, unless Private Content configuration is requested._

***

## Crownpeak Search G2 Private Content Architecture
Crownpeak Search G2 Private Content works by restricting access to an entire Crownpeak Search G2 Collection. In order to interact with Crownpeak Search G2 Private Content Collections, request **MUST** be made:

* Using HTTPS (i.e. https://searchg2-restricted.crownpeak.net/{crownpeak\_searchg2\_collection\_name}/{query};
* Using TLS1.2;
* Appending the the correct customer-specific client certificate to the request.

If any of the above conditions are not met, the request will be met with an "Access Denied" page, and 403 (Forbidden) response code.

To allow use-case specific security for Crownpeak Search G2 Private Content Collections, all requests to the Crownpeak Search G2 Collection are typically routed via a software proxy / script / handler / filter that resides within the target website. This approach enables:

* Use-case specific authentication to content within the Crownpeak Search G2 Private Content Collection - using the same authentication mechanisms as the target website;
* Use-case specific authorization to content within the Crownpeak Search G2 Private Content Collection - using the same authorization mechanisms as the target website (e.g. FilterQueries to be applied depending upon the authenticated user's authorization scope - ideal for securing specific content on a per-user or group basis).

![Crownpeak Logo](../images/diagrams/searchg2-privatecontent-architecure.png?raw=true "Crownpeak Search G2 Private Content Architecture Diagram")

_Note: An example of an ASP.net Search G2 Software Proxy script is shown below. However, Crownpeak is not responsible for deployment, maintenance or suitability of your Search G2 Software Proxy Script / Handler / Module / Filter. Please consider your individual authentication & authorization requirements carefully._

***

## Configuring Crownpeak Search G2 Private Content Collections & Communication Requirements
In order to configure Crownpeak Search G2 Private Content Collections:

* Raise a ticket, or send an email to support@crownpeak.com, requesting that a new Crownpeak Search G2 Private Content Collection be created. Specify all workflow states that require securing;

Upon receipt of your support request, Crownpeak will:

* Generate a customer-specific client certificate & private key. You will be provided with the certificate Thumbprint, which you will use to reference it within your implementation. *Crownpeak will NOT provide you with the certificate & private key itself unless you specifically request it;*
* Create your Crownpeak Search G2 Private Content Collections, secured by the customer-specific client certificate & private key. You will be provided with the identifier of the Crownpeak Search G2 Private Content Collections;
* Deploy the customer-specific client certificate & private key to your web servers & grant access to the relevant identity (i.e. Application Pool User in the case of Microsoft IIS).

You can then create your Crownpeak Search G2 Software Proxy Script / Handler / Module / Filter and deploy this to your website, referencing the customer-specific client certificate's Thumbprint. Make sure that your individual authentication & authorization requirements are included.

The [Crownpeak Search G2 SDK](../search-g2-sdk-javascript-examples/README.md) includes a property on the CrownPeakSearch object to enable you to specify the location of the Crownpeak Search G2 Software Proxy Script / Handler / Module / Filter.

```
cps.endpoint("https://searchg2-restricted.crownpeak.net/%%COLLECTION%%/%%HANDLER%%?%%QUERY%%");
cps.searchProxy("{your_proxy_location}?q=%%URLENCODED%%");
```

_NOTE: If you are planning to make an existing Crownpeak Search G2 Collection Private, then you will need to re-order the tasks above to ensure continue service. Unless the correct customer-specific client certificate is supplied, all requests will return a Forbidden (403) status code._

***

### Example Microsoft ASP.net Crownpeak Search G2 Software Proxy Script
```
<script runat="server" language="c#">
	private readonly string[] _allowedEndPoints = { "searchg2-restricted.crownpeak.net" };
	public void Page_Load(object sender, EventArgs e)
	{
		try
		{
			if (Request.QueryString["q"] == null) throw new ArgumentNullException("q");
			var proxyRequest = Server.UrlDecode(Request.QueryString["q"]);  
			var proxyRequestDomain = GetDomainNameFromUrl(proxyRequest);
			if (!_allowedEndPoints.Contains(proxyRequestDomain)) throw new UnauthorizedAccessException(String.Format("Your attempt to access {0} has been denied for security reasons.", proxyRequestDomain));
			System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
			
			var httpWebRequest = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(proxyRequest);
			httpWebRequest.UserAgent = "Crownpeak Search Proxy";
			httpWebRequest.Method = System.Net.WebRequestMethods.Http.Get;
			
			var store = new System.Security.Cryptography.X509Certificates.X509Store(
				System.Security.Cryptography.X509Certificates.StoreName.My,
				System.Security.Cryptography.X509Certificates.StoreLocation.LocalMachine);
			store.Open(System.Security.Cryptography.X509Certificates.OpenFlags.ReadOnly);

			foreach (var cert in store.Certificates.Cast<System.Security.Cryptography.X509Certificates.X509Certificate2>()
				.Where(cert => String.Equals(cert.Thumbprint, "{CERTIFICATE_THUMBPRINT}", StringComparison.CurrentCultureIgnoreCase)))
			{
				httpWebRequest.ClientCertificates.Add(cert);
				break;
			}
			
			httpWebRequest.AllowAutoRedirect = false;
			using (var httpWebResponse = (System.Net.HttpWebResponse)httpWebRequest.GetResponse())
			{
				Response.BufferOutput = false;
				Response.ContentType = httpWebResponse.ContentType;
				httpWebResponse.GetResponseStream().CopyTo(Response.OutputStream);
				
			}
		}
		catch (Exception ex)
		{
			//TODO: Error handling/logging
			throw;
		}
	}
	
	public static string GetDomainNameFromUrl(string url)
	{
		if (url.Contains(@"://")) url = url.Split(new[] { "://" }, 2, StringSplitOptions.None)[1];
		return url.Split('/')[0];
	}
</script>
```
_Note: This is an example of an ASP.net Search G2 Software Proxy script. However, Crownpeak is not responsible for deployment, maintenance or suitability of your Search G2 Software Proxy Script / Handler / Module / Filter. Please consider your individual authentication & authorization requirements carefully._

***

## Disclaimer

THIS SITE IS EXPERIMENTAL AND MAY BE REMOVED AT ANY TIME.

THIS SOFTWARE IS PROVIDED "AS-IS," WITHOUT ANY EXPRESS OR IMPLIED WARRANTY.

IN NO EVENT SHALL CROWNPEAK TECHNOLOGY BE HELD LIABLE FOR ANY DAMAGES ARISING FROM THE USE OF THE SOFTWARE.

THIS SOFTWARE IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL, BUT WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS (INCLUDING BOTH CROWN PEAK TECHNOLOGY AND THE VARIOUS THIRD PARTY COPYRIGHT HOLDERS PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU, THE USER. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER PROGRAMS), EVEN IF SUCH HOLDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.