using WRIO.Extensions;

namespace WRIO.api
{
    public class ProfileGuestloginController : CustomApiController
    {
        // POST api/loginguest
        public bool Post()
        {
            if (!Profile.IsAuthenticated)
            {
                Profile.OneClickSignUp();
            }
            return Profile.IsAuthenticated;
        }
    }
}
