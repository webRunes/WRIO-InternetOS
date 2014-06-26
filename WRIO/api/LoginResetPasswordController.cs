using System.Web.Http;
using WRIO.Extensions;
using WRIO.Models;

namespace WRIO.api
{
    public class LoginResetPasswordController : CustomApiController
    {
        // POST api/loginrestoreaccount
        public bool Post([FromBody]SignInModel value)
        {
            if (Profile.UserService.IsEmailExist(value.Email))
            {
                //Profile.
                var worker = new EmailWorker();
                worker.SendEmail(value.Email, "Reset password", "Your password has been changed");
                return true;
            }
            return false;
        }

        // DELETE api/loginrestoreaccount/5
        public void Delete(int id)
        {
        }
    }
}
