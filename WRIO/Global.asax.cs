using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WRIO.App_Start;

namespace WRIO
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            OAuthConfig.RegisterAuth();
        }

        private static readonly object lockObject = new object();

        protected void Application_Error(object sender, EventArgs e)
        {
            lock (lockObject)
            {
                Exception exception = Server.GetLastError();

                HttpRequest httpRequest = Context.Request;

               // new LogService().SaveExceptionLog(exception, httpRequest);
            }
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            Session["loginCount"] = 0;
        }
    }
}
