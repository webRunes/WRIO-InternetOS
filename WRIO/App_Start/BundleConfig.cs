using System.Web;
using System.Web.Optimization;

namespace WRIO
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                   "~/Scripts/underscore.js"));

            bundles.Add(
                new ScriptBundle("~/bundles/angular").Include(
                    "~/app/js/angular/angular-ui-router.js",
                    "~/app/js/angular/angular-sanitize.js"));

            bundles.Add(new ScriptBundle("~/bundles/application")
                .Include("~/app/app.js")
                .IncludeDirectory("~/app/services", "*.js")
                .IncludeDirectory("~/app/filters", "*.js")
                .IncludeDirectory("~/app/directives", "*.js")
                .IncludeDirectory("~/app/controllers", "*.js")
                );

            BundleTable.EnableOptimizations = false;
        }
    }
}