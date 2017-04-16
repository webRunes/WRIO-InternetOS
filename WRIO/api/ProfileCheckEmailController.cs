using System.Web.Http;
using WRIO.Extensions;
using WRIO.Models;

namespace WRIO.api
{
    public class ProfileCheckEmailController : CustomApiController
    {

        public bool Post([FromBody]SignInModel model)
        {
            if (string.IsNullOrEmpty(model.Email)) return true;

            var isExist = Profile.UserService.IsEmailExist(model.Email);
            return isExist;
        }
    }
}
