namespace WRIO.api
{
    using System.Web.Http;
    using WRIO.Extensions;
    using WRIO.Models;


    public class PasswordController : CustomApiController
    {
        public bool Post([FromBody] SignInModel model)
        {
            return model.IsValidPassword;
        }
    }
}