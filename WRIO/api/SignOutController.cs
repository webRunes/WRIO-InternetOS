using System.Net.Mail;
using System.Web.Http;
using WRIO.Extensions;
using WRIO.Models;

namespace WRIO.api
{
    public class SignOutController : CustomApiController
    {
        //
        // GET: /SignOut/

        public bool Post()
        {
            if (Profile.IsAuthenticated)
            {
                return Profile.UserService.SignOut();
            }
            return false;
        }

    }
}
