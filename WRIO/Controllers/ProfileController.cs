using System;
using System.Text;
using System.Web.Mvc;
using Login.Repository.Entity;
using WRIO.Extensions;
using WRIO.Models;
using WRIO.Models.Login;



namespace WRIO.Controllers
{
    public class ProfileController : CustomControllerBase
    {
        protected int LoginCount
        {
            get { return (int) Session["loginCount"]; }
            set { Session["loginCount"] = value; }
        }

        public ActionResult Login()
        {
            if (Profile.IsAuthenticated)
            {
                return this.Redirect("~/app/plus/");
            }

            var rPassword = Session["resetpassword"];
            if (rPassword != null)
            {
                Session.Remove("resetpassword");
                return View("Login", (rPassword as UserLoginModel));
            }
            var sModel = Session["signup"];
            if (sModel != null)
            {
                Session.Remove("resetpassword");
                var signUpModel = sModel as UserLoginModel;
                signUpModel.IsSignUpTab = true;
                return View("Login", signUpModel);
            }
            var tryToLogin = Session["trytologin"] as UserLoginModel;
            if (tryToLogin != null)
            {
                Session.Remove("trytologin");
                return View("Login", tryToLogin);
            }
            //return this.Redirect("~/login/");
            return View("Login", new UserLoginModel(Profile.AccountCollection));
        }

        [HttpGet]
        public ActionResult ResetPassword(string re_password)
        {
            var dataArr = re_password.Split('_');
            var model = new UserLoginModel(Profile);
            model.Email = dataArr[0];
            //if (ResetPasswordConfirmation.IsValidConfirmationQuery(dataArr[0], dataArr[1]))
            //{
            //    model.ResetPassword = true;
            //    Session["resetpassword"] = model;
            //}
            return RedirectToAction("Login");
        }

        [HttpPost]
        public ActionResult Login(UserLoginModel model)
        {
            if (null == model)
            {
                return RedirectToAction("Login");
            }
            if (model.IsValidEmail && model.IsValidPassword)
            {
                var userEntity = Profile.UserService.Login(model.Email, model.Password, model.IsStaySignedIn);
                if (userEntity == null)
                {
                    model.Password = string.Empty;
                }
                if (Profile.IsAuthenticated)
                {
                    return RedirectToAction("Registration");
                }
            }
            model.IsEmailRequired = !model.IsValidEmail;
            model.IsPasswordRequired = model.IsValidPassword;
            return View("Login", model);
        }

        [HttpParamAction]
        public ActionResult TryToLogin(TryToLoginModel model)
        {
            var userEntity = Profile.UserService.Login(model.Email, model.Password);
            if (userEntity == null)
            {
                Session["trytologin"] = new UserLoginModel(Profile)
                                            {
                                                IsValidEmail = true,
                                                IsValidPassword = true,
                                                ForgotPassword = true,
                                                AccountCollection = Profile.AccountCollection
                                            };
                return RedirectToAction("Login");
            }
            return RedirectToAction("Accounts");
        }

        public JsonResult IsEmailExist(string email)
        {
            var isExist = Profile.UserService.IsEmailExist(email);
            return Json(new {isExist = isExist});
        }

        public ActionResult OneClickSignUp()
        {
            if (!Profile.IsAuthenticated)
            {
                Profile.OneClickSignUp();
            }
            return RedirectToAction("Registration");
        }

        public ActionResult Registration()
        {
            if (Profile.IsAuthenticated)
            {
                var model = Session["regModel"];
                if (null == model)
                {
                    return View("Registration", new RegistrationModel(Profile.CurrentUser));
                }
                else
                {
                    Session["regModel"] = null;
                    return View("Registration", model as RegistrationModel);
                }
            }
            return RedirectToAction("Login", new UserLoginModel(Profile));

        }

        [HttpPost]
        [HttpParamAction]
        public JsonResult SendToResetPassword(string email)
        {
            return Json(new {iscorrect = false});
        }

        [HttpParamAction]
        public ActionResult DeleteAccount(DeleteAccountModel model)
        {
            if (Profile.IsAuthenticated)
            {
                //send to email model.Description;
                var curUser = Profile.CurrentUser;
                // Profile.UserService.SignOut();
                Profile.UserService.DeleteUserFromContext(curUser.Id);
                Profile.UserService.DeleteCurrentUser(curUser);
                return RedirectToAction("Login", new UserLoginModel(Profile));
            }
            return RedirectToAction("Registration", new RegistrationModel());
        }

        [HttpParamAction]
        public ActionResult DeleteUser(DeleteAccountModel model)
        {
            if (Profile.IsAuthenticated)
            {
                var curUser = Profile.CurrentUser;
                if (!string.IsNullOrEmpty(curUser.PasswordHash))
                {
                    if (!Profile.VerifiedPassword(model.Password))
                    {
                        var regModel = new RegistrationModel(Profile.CurrentUser);
                        regModel.IsConfirmationPasswordInCorrect = true;
                        Session["regModel"] = regModel;
                        return RedirectToAction("Registration");
                    }
                }

                Profile.UserService.DeleteUserFromContext(curUser.Id);
                Profile.UserService.DeleteCurrentUser(curUser);
                //SendDeleteAccountEmail(model.Description, curUser);

            }
            return RedirectToAction("Login", new UserLoginModel(Profile));
        }

        private void SendDeleteAccountEmail(string description, UserAccount user)
        {
            var strBuilder = new StringBuilder();
            if (!string.IsNullOrEmpty(user.NickName))
            {
                strBuilder.AppendFormat("User name: {0}", user.NickName);
            }
            else
            {
                strBuilder.Append("User name: Guest");
            }
            strBuilder.Append("<br/>");
            if (!string.IsNullOrEmpty(user.Email))
            {
                if (user.Email.IndexOf('@') != -1)
                {
                    strBuilder.AppendFormat("User e-mail: {0}", user.Email);
                }
            }
            strBuilder.AppendFormat("Registration date: {0}", user.RegistrationDate);
            strBuilder.AppendFormat("Login date: {0}", user.LoginDate);
           // var mailer = new DeleteAcountConfirmation();
           // mailer.Send(description);
        }

        [HttpParamAction]
        public ActionResult Logout()
        {
            if (Profile.IsAuthenticated)
            {
                Profile.UserService.SignOut();
            }

            return RedirectToAction("Login", new UserLoginModel(Profile));
        }

        [HttpParamAction]
        public ActionResult RegistrateUser(RegistrationModel model)
        {
            if (!Profile.IsAuthenticated)
            {
                var emailExist = Profile.UserService.IsEmailExist(model.Email);
                if (model.IsEmailCorrect && model.IsPasswordCorrect && !emailExist)
                {
                    if (!Profile.UserService.IsUserRegistered(model.Email, model.Password))
                    {
                        model.Culture = Profile.CurrentCulture;
                        Profile.UserService.RegistrateUser(model);
                        Profile.UserService.Login(model.Email, model.Password);
                        return Redirect("/Profile/Accounts");
                    }
                }
                else
                {
                    var loginModel = new UserLoginModel(Profile);
                    loginModel.Email = model.Email;
                    if (!model.IsEmailCorrect)
                    {
                        loginModel.SignUpEmailIsIncorrect = true;
                    }
                    if (!model.IsPasswordCorrect)
                    {
                        loginModel.SignUpPasswordIsIncorrect = true;
                    }
                    if (emailExist)
                    {
                        loginModel.IsEmailExist = true;
                    }
                    Session["signup"] = loginModel;
                    return RedirectToAction("Login");
                }
            }
            else
            {
                var currentUser = Profile.UserService.UpdateUser(model);
                Profile.UserService.SignOut();
                if (model.IsEmailCorrect && model.IsPasswordCorrect)
                {
                    Profile.UserService.Login(model.Email, model.Password);
                }
                else
                {
                    Profile.UserService.Login(currentUser);
                }
            }
            return RedirectToAction("Accounts");
        }

        [HttpPost]
        public ActionResult SendNewPassword(UserLoginModel model)
        {
            if (null == model) return View("Login");
            if (model.Password.Length > 0 && model.Password.Length < 65)
            {
                var regmodel = new RegistrationModel();
                regmodel.Culture = Profile.CurrentCulture;
                regmodel.Password = model.Password;
                regmodel.Email = model.Email;
                Profile.UserService.UpdateUserPassword(regmodel);
                Profile.UserService.Login(regmodel.Email, regmodel.Password);
                return RedirectToAction("Registration");
            }
            return View("Login", model);
        }

        public ActionResult Accounts()
        {
            if (!Profile.IsAuthenticated) return RedirectToAction("Login", new UserLoginModel(Profile));
            RegistrationModel model = new RegistrationModel(Profile.CurrentUser) {OpenFirstTab = true};
            return View("Registration", model);
        }

        [HttpPost]
        public JsonResult CheckPassword(string iscorrect)
        {
            if (!string.IsNullOrEmpty(Profile.CurrentUser.PasswordHash))
            {
                if (!Profile.VerifiedPassword(iscorrect))
                {
                    return Json(new {iscorrect = false});
                }
            }
            return Json(new {iscorrect = true});
        }

       
        [HttpPost]
        public JsonResult SetGsRate(double rate)
        {
            return Json(new {});
        }

        public JsonResult CheckUser()
        {
            if (Profile.IsAuthenticated)
            {
                return Json(new
                                {
                                    Avatar = Profile.CurrentUser.Avatar,
                                    Description = Profile.CurrentUser.Description,
                                    NickName = Profile.CurrentUser.NickName,
                                    Id = Profile.CurrentUser.Id,
                                    Email = Profile.CurrentUser.Email
                                }, JsonRequestBehavior.AllowGet);
            }
            return null;
        }
    }
}
