using System.Web.Mvc;
using CustomOAuthClient;
using Microsoft.Web.WebPages.OAuth;

namespace WRIO.Extensions
{
    internal class ExternalLoginResult : ActionResult
    {
        public ExternalLoginResult(OAuthProvider oAuthProvider, string returnUrl)
        {
            Provider = oAuthProvider.ToString().ToLower();
            ReturnUrl = returnUrl;
        }

        public string Provider { get; private set; }
        public string ReturnUrl { get; private set; }

        public override void ExecuteResult(ControllerContext context)
        {
            OAuthWebSecurity.RequestAuthentication(Provider, ReturnUrl);
            //OpenAuth.RequestAuthentication(Provider, ReturnUrl);
        }
    }
}