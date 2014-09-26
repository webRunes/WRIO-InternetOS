using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WRIO
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "LoginService",
                url: "LoginService/{action}/{id}",
                defaults: new { controller = "LoginService", action = "Login", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Titter",
                url: "titter/{action}/{id}",
                defaults: new { controller = "Titter", action = "Login", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{*path}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}