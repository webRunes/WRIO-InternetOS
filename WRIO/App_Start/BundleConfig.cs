using System.Web;
using System.Web.Optimization;

namespace WRIO
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                   "~/Scripts/underscore.js"));

            bundles.Add(
                new ScriptBundle("~/bundles/angular").Include(
                    "~/vertical/js/angular/angular-ui-router.js",
                    "~/vertical/js/angular/angular-sanitize.js"));

            bundles.Add(new ScriptBundle("~/bundles/application")
                .Include("~/vertical/app.js")
                .IncludeDirectory("~/vertical/services", "*.js")
                .IncludeDirectory("~/vertical/filters", "*.js")
                .IncludeDirectory("~/vertical/directives", "*.js")
                .IncludeDirectory("~/vertical/controllers", "*.js")
                );

            BundleTable.EnableOptimizations = false;
        }
    }
}
