using System.Web.Optimization;

namespace CE.PortalWeb
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery.plugin").Include(
                "~/libs/jquery/jquery.cookie.js",
                "~/libs/jquery/jquery.blockUI.js",
                "~/libs/jquery/jquery.nicescroll.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/libs/bootstrap-3.3.5/js/bootstrap.min.js"
            ));
            bundles.Add(new ScriptBundle("~/bundles/bootbox").Include(
                "~/libs/bootbox/bootbox.js"
                ));
            BundleTable.EnableOptimizations = false;
        }
    }
}
