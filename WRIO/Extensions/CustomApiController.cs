using System.Web;
using System.Web.Http;
using Login.Services;

namespace WRIO.Extensions
{
    public class CustomApiController : ApiController , ICustomApiController
    {
        public new HttpContextBase HttpContext
        {
            get
            {
                var context =
                    new HttpContextWrapper(System.Web.HttpContext.Current);
                return (HttpContextBase)context;
            }
        }

        private Login.Services.Profile _profile;
        public new Login.Services.Profile Profile
        {
            get { return _profile ?? (_profile = new Login.Services.Profile(HttpContext.ApplicationInstance.Context)); }
        }
    }

    public interface ICustomApiController
    {
    }
}