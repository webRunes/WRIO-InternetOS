using System.Net.Mail;
using System.Web.Http;
using WRIO.Extensions;
using WRIO.Models;


namespace WRIO.api
{
    public class LoginSignInController : CustomApiController
    {
        // POST api/wallets
        public string Post([FromBody]SignInModel model)
        {
            if (model.IsValidEmail && model.IsValidPassword)
            {
                var userEntity = Profile.UserService.Login(model.Email, model.Password, model.Remember);
                if (userEntity == null)
                {
                    model.Password = string.Empty;
                }
                else
                {
                    if (Profile.IsAuthenticated)
                    {
                        return Profile.CurrentUser.Id;
                    }
                }
               
            }
            return null;
        }
    }
    
}


