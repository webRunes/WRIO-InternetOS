using System.Web.Http;
using Login.Repository.ModelInterfaces;
using WRIO.Extensions;
using WRIO.Models;

namespace WRIO.api
{
    public class ProfileRegistrationController : CustomApiController
    {
       
        // POST api/loginregistration
        public bool Post([FromBody]SignInModel model)
        {
            if(!Profile.IsAuthenticated)
            {
                var emailExist = Profile.UserService.IsEmailExist(model.Email);
                if (model.IsValidEmail && model.IsValidPassword && !emailExist)
                {
                    if (!Profile.UserService.IsUserRegistered(model.Email, model.Password))
                    {
                       // model.Culture = Profile.CurrentCulture;
                        Profile.UserService.RegistrateUser(new UserRegistrationModel(model));
                        Profile.UserService.Login(model.Email, model.Password);
                       // return true;
                    }
                }
                else
                {
                    return false;
                }
            }
            else
            {
                var currentUser = Profile.UserService.UpdateUser(new UserRegistrationModel(model));
                Profile.UserService.SignOut();
                if (model.IsValidEmail && model.IsValidPassword)
                {
                    Profile.UserService.Login(model.Email, model.Password);
                }
                else
                {
                    Profile.UserService.Login(currentUser);
                }
            }
            return true;
        }
    }

    public class UserRegistrationModel : IRegistrationModel
    {
        public UserRegistrationModel(SignInModel model)
        {
            Email = model.Email;
            Password = model.Password;
        }

        public string Id { get; set; }
        public string Email { get; set; }
        public string NickName { get; set; }
        public string Avatar { get; set; }
        public string Password { get; set; }
        public string Old_Password { get; set; }
        public string Description { get; set; }
        public string Culture { get; set; }
    }
}
