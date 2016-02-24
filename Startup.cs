using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CE.PortalWeb.Startup))]
namespace CE.PortalWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
