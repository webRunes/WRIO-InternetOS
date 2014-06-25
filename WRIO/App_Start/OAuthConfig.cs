using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WRIO.App_Start
{
    public static class OAuthConfig
    {
        public static void RegisterAuth()
        {
            //OAuthWebSecurity.CreateOrUpdateAccount(provider, providerUserId, model.UserName);
            //OAuthWebSecurity.Login(provider, providerUserId, createPersistentCookie: false);

            //return RedirectToLocal(returnUrl);
            // See http://go.microsoft.com/fwlink/?LinkId=252803 for details on setting up this ASP.NET
            // application to support logging in via external services.

            // OpenAuth.AuthenticationClients.AddFacebook("550557608347044", "bde89d3fe83a73d2bc44dbdceb3c3794");
            // OAuthWebSecurity.RegisterTwitterClient(consumerKey: "zUJ0wnJnxnH5LdVEV8DmQ", consumerSecret: "bde89d3fe83a73d2bc44dbdceb3c3794");
            //OpenAuth.AuthenticationClients.AddTwitter("key","pwd");
            // OpenAuth.AuthenticationClients.AddTwitter("zUJ0wnJnxnH5LdVEV8DmQ", "wxwzsiRFKXFY6VFxoW3E7BMQecOgIvjecR3KhTSonQ");

            /*
             Twitter

            name
            location
            description
            url
            accesstoken
            https://dev.twitter.com/docs/auth/oauth/faq is a good place to look for more information
             */
            // OpenAuth.AuthenticationClients.AddTwitter(
            //    consumerKey: "your Twitter consumer key",
            //    consumerSecret: "your Twitter consumer secret");

           // OAuthWebSecurity.RegisterFacebookClient("550557608347044", "bde89d3fe83a73d2bc44dbdceb3c3794");
            /*Facebook

            id
            Name
            link
            gender
            accesstoken
            http://developers.facebook.com/docs/ is a good place to look for more information*/

            //OpenAuth.AuthenticationClients.AddFacebook(
            //    appId: "your Facebook app id",
            //    appSecret: "your Facebook app secret");

            //OpenAuth.AuthenticationClients.AddMicrosoft(
            //    clientId: "your Microsoft account client id",
            //    clientSecret: "your Microsoft account client secret");

            //OpenAuth.AuthenticationClients.AddGoogle();
            // OAuthWebSecurity.RegisterGoogleClient("Webrunes Google", () => new GoogleCustomClient());

            /*
             Google

            email
            firstname
            lastname
            country
            https://developers.google.com/accounts/docs/OpenID is a good place to look for more information
             */

            //Google: email, country, firstName, lastName
            //Microsoft: name, link, gender, firstname, lastname
            //Facebook: username (which is really an email address), name, link (URL to their facebook page), gender, birthday
            //Twitter: name, location, description, url (URL to their Twitter page)
            //Yahoo: email, fullName
            //LinkedIn: name, headline, summary, industry
        }
    }
}