using System.Configuration;
using System.Web;
using System.Web.Mvc;
using UserAccount;

namespace WRIO.Extensions
{
    public class CustomControllerBase : Controller
    {
        public HttpContextBase HttpContext
        {
            get
            {
                var context =
                    new HttpContextWrapper(System.Web.HttpContext.Current);
                return (HttpContextBase)context;
            }
        }

        private string connection;
        protected string Connection
        {
            get
            {
                if (string.IsNullOrEmpty(connection))
                {
                    connection = ConfigurationManager.ConnectionStrings["MySqlWrioCore"].ConnectionString;
                }
                return connection;
            }
        }

        private IProfile profile;
        public new IProfile Profile
        {
            get { return profile ?? (profile = new Profile(HttpContext.ApplicationInstance.Context, Connection)); }
        }
    }
}