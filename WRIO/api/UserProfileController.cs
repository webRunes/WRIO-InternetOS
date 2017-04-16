using System;
using WRIO.Extensions;

namespace WRIO.api
{
    public class UserProfileController : CustomApiController
    {
        // GET api/userprofile/5
        public UserProfile Get(Guid id)
        {
            if (Profile.IsAuthenticated && Profile.CurrentUser.Id.Equals(id.ToString()))
            {
                return new UserProfile
                    {
                        Avatar = Profile.CurrentUser.Avatar,
                        Description = Profile.CurrentUser.Description,
                        NickName = Profile.CurrentUser.NickName,
                        Id = Profile.CurrentUser.Id,
                        Email = Profile.CurrentUser.Email
                    };
            }
            return null;
        }

        public class UserProfile
        {
            public string Id { get; set; }
            public string Avatar { get; set; }
            public string Description { get; set; }
            public string NickName { get; set; }
            public string Email { get; set; }
        }
    }
}
