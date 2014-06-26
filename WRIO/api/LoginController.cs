using Login.Services;
using WRIO.Extensions;

namespace WRIO.api
{
    public class LoginController : CustomApiController
    {
        public bool Post()
        {
            if(Profile.IsAuthenticated)
            {
                return true;
            }
            return false;
        }
    }
}
