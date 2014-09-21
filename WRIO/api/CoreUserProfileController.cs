using System;
using UserAccount;
using WRIO.Extensions;

namespace WRIO.api
{
    public class CoreUserProfileController : CustomApiController
    {
        // GET api/userprofile/5
        public UserPublicProfile Get(Guid id)
        {
            if (Profile.IsAuthenticated && Profile.GetUserAccountId().Equals(id.ToString()))
            {
                return Profile.GetUserPublicProfile();
            }
            return null;
        }
    }
}
