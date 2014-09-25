using System.Configuration;
using System.Web;
using System.Web.Http;
using UserAccount;

namespace WRIO.Extensions
{
    public class CustomApiController : ApiController
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

        private IProfile _profile;
        public IProfile Profile
        {
            get { return _profile ?? (_profile = new Profile(HttpContext.ApplicationInstance.Context, Connection)); }
        }
    }
}