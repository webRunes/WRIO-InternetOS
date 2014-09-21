using System;
using System.Web.Mvc;
using UserAccount.Authorization;
using WRIO.Extensions;

namespace WRIO.Controllers
{
    public class LoginServiceController : CustomControllerBase
    {
        [HttpPost]
        public JsonResult Login(RegistrationTokenModel token)
        {
            if (Profile.IsAuthenticated)
                throw new Exception("User isAuthenticated");

            return Json(new { UserId = Profile.LoginBySocialNT(token) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public bool LogOut(Guid id)
        {
            if (!Profile.IsAuthenticated)
                throw new Exception("User is not Authenticated");
            return Profile.LogOut(id);
        }

        //[HttpParamAction]
        //public ActionResult TryToLogin(TryToLoginModel model)
        //{
        //    var userEntity = Profile.UserService.Login(model.Email, model.Password);
        //    if (userEntity == null)
        //    {
        //        Session["trytologin"] = new UserLoginModel(Profile)
        //                                    {
        //                                        IsValidEmail = true,
        //                                        IsValidPassword = true,
        //                                        ForgotPassword = true,
        //                                        AccountCollection = Profile.AccountCollection
        //                                    };
        //        return RedirectToAction("Login");
        //    }
        //    return RedirectToAction("Accounts");
        //}

        //public JsonResult IsEmailExist(string email)
        //{
        //    var isExist = Profile.UserService.IsEmailExist(email);
        //    return Json(new {isExist = isExist});
        //}

        //public ActionResult OneClickSignUp()
        //{
        //    if (!Profile.IsAuthenticated)
        //    {
        //        Profile.OneClickSignUp();
        //    }
        //    return RedirectToAction("Registration");
        //}

        //public ActionResult Registration()
        //{
        //    if (Profile.IsAuthenticated)
        //    {
        //        var model = Session["regModel"];
        //        if (null == model)
        //        {
        //            return View("Registration", new RegistrationModel(Profile.CurrentUser));
        //        }
        //        else
        //        {
        //            Session["regModel"] = null;
        //            return View("Registration", model as RegistrationModel);
        //        }

        //        //var modelCollection = Profile.GetProfileCollection();
        //        //var profileCollectionModel = new ProfileCollectionModel() { ProfileCollection = modelCollection };
        //        //return View("Accounts", profileCollectionModel);
        //    }
        //    return RedirectToAction("Login", new UserLoginModel(Profile));

        //}

        //[HttpPost]
        //[HttpParamAction]
        //public JsonResult SendToResetPassword(string email)
        //{
        //    //if (Profile.UserService.IsEmailExist(email))
        //    //{
        //    //    var rPassword = new ResetPasswordConfirmation(email);
        //    //    rPassword.Send("profile", "resetPassword");
        //    //    return Json(new {iscorrect = true});
        //    //}
        //    return Json(new {iscorrect = false});
        //}

        //[HttpParamAction]
        //public ActionResult DeleteAccount(DeleteAccountModel model)
        //{
        //    if (Profile.IsAuthenticated)
        //    {
        //        //send to email model.Description;
        //        var curUser = Profile.CurrentUser;
        //        // Profile.UserService.SignOut();
        //        Profile.UserService.DeleteUserFromContext(curUser.Id);
        //        Profile.UserService.DeleteCurrentUser(curUser);
        //        return RedirectToAction("Login", new UserLoginModel(Profile));
        //    }
        //    return RedirectToAction("Registration", new RegistrationModel());
        //}

        //[HttpParamAction]
        //public ActionResult DeleteUser(DeleteAccountModel model)
        //{
        //    if (Profile.IsAuthenticated)
        //    {
        //        var curUser = Profile.CurrentUser;
        //        if (!string.IsNullOrEmpty(curUser.PasswordHash))
        //        {
        //            if (!Profile.VerifiedPassword(model.Password))
        //            {
        //                var regModel = new RegistrationModel(Profile.CurrentUser);
        //                regModel.IsConfirmationPasswordInCorrect = true;
        //                Session["regModel"] = regModel;
        //                return RedirectToAction("Registration");
        //            }
        //        }

        //        Profile.UserService.DeleteUserFromContext(curUser.Id);
        //        Profile.UserService.DeleteCurrentUser(curUser);
        //        //SendDeleteAccountEmail(model.Description, curUser);

        //    }
        //    return RedirectToAction("Login", new UserLoginModel(Profile));
        //}

        ////private void SendDeleteAccountEmail(string description, UserAccount user)
        ////{
        ////    //var strBuilder = new StringBuilder();
        ////    //if (!string.IsNullOrEmpty(user.NickName))
        ////    //{
        ////    //    strBuilder.AppendFormat("User name: {0}", user.NickName);
        ////    //}
        ////    //else
        ////    //{
        ////    //    strBuilder.Append("User name: Guest");
        ////    //}
        ////    //strBuilder.Append("<br/>");
        ////    //if (!string.IsNullOrEmpty(user.Email))
        ////    //{
        ////    //    if (user.Email.IndexOf('@') != -1)
        ////    //    {
        ////    //        strBuilder.AppendFormat("User e-mail: {0}", user.Email);
        ////    //    }
        ////    //}
        ////    //strBuilder.AppendFormat("Registration date: {0}", user.RegistrationDate);
        ////    //strBuilder.AppendFormat("Login date: {0}", user.LoginDate);
        ////   // var mailer = new DeleteAcountConfirmation();
        ////   // mailer.Send(description);
        ////}

        //[HttpParamAction]
        //public ActionResult Logout()
        //{
        //    if (Profile.IsAuthenticated)
        //    {
        //        Profile.UserService.SignOut();
        //    }

        //    return RedirectToAction("Login", new UserLoginModel(Profile));
        //}

        //[HttpParamAction]
        //public ActionResult RegistrateUser(RegistrationModel model)
        //{
        //    if (!Profile.IsAuthenticated)
        //    {
        //        var emailExist = Profile.UserService.IsEmailExist(model.Email);
        //        if (model.IsEmailCorrect && model.IsPasswordCorrect && !emailExist)
        //        {
        //            if (!Profile.UserService.IsUserRegistered(model.Email, model.Password))
        //            {
        //                model.Culture = Profile.CurrentCulture;
        //                Profile.UserService.RegistrateUser(model);
        //                Profile.UserService.Login(model.Email, model.Password);
        //                return Redirect("/Profile/Accounts");
        //            }
        //        }
        //        else
        //        {
        //            var loginModel = new UserLoginModel(Profile);
        //            loginModel.Email = model.Email;
        //            if (!model.IsEmailCorrect)
        //            {
        //                loginModel.SignUpEmailIsIncorrect = true;
        //            }
        //            if (!model.IsPasswordCorrect)
        //            {
        //                loginModel.SignUpPasswordIsIncorrect = true;
        //            }
        //            if (emailExist)
        //            {
        //                loginModel.IsEmailExist = true;
        //            }
        //            Session["signup"] = loginModel;
        //            return RedirectToAction("Login");
        //        }
        //    }
        //    else
        //    {
        //        var currentUser = Profile.UserService.UpdateUser(model);
        //        Profile.UserService.SignOut();
        //        if (model.IsEmailCorrect && model.IsPasswordCorrect)
        //        {
        //            Profile.UserService.Login(model.Email, model.Password);
        //        }
        //        else
        //        {
        //            Profile.UserService.Login(currentUser);
        //        }
        //    }
        //    return RedirectToAction("Accounts");
        //}

        //[HttpPost]
        //public ActionResult SendNewPassword(UserLoginModel model)
        //{
        //    if (null == model) return View("Login");
        //    if (model.Password.Length > 0 && model.Password.Length < 65)
        //    {
        //        var regmodel = new RegistrationModel();
        //        regmodel.Culture = Profile.CurrentCulture;
        //        regmodel.Password = model.Password;
        //        regmodel.Email = model.Email;
        //        Profile.UserService.UpdateUserPassword(regmodel);
        //        Profile.UserService.Login(regmodel.Email, regmodel.Password);
        //        return RedirectToAction("Registration");
        //    }
        //    return View("Login", model);
        //}

        //public ActionResult Accounts()
        //{
        //    if (!Profile.IsAuthenticated) return RedirectToAction("Login", new UserLoginModel(Profile));
        //    // var modelCollection = Profile.GetProfileCollection();
        //    //var curUser = Profile.CurrentUser;
        //    //var model = new ProfileModel();
        //    //model.Avatar = curUser.Avatar;
        //    //model.Date = curUser.RegistrationDate.ToString();
        //    //model.Description = curUser.Description;
        //    //model.Name = curUser.NickName;
        //    //model.IsCurrent = !string.IsNullOrEmpty(curUser.PasswordHash);
        //    //if (modelCollection.Count == 0)
        //    //{
        //    //    Profile.UserService.SignOut();
        //    //    return View("Login");
        //    //}
        //    //var profileCollectionModel = new ProfileCollectionModel() { ProfileCollection = modelCollection };
        //    RegistrationModel model = new RegistrationModel(Profile.CurrentUser) {OpenFirstTab = true};
        //    return View("Registration", model);
        //}

        //[HttpPost]
        //public JsonResult CheckPassword(string iscorrect)
        //{
        //    if (!string.IsNullOrEmpty(Profile.CurrentUser.PasswordHash))
        //    {
        //        if (!Profile.VerifiedPassword(iscorrect))
        //        {
        //            return Json(new {iscorrect = false});
        //        }
        //    }
        //    return Json(new {iscorrect = true});
        //}
       
        //[HttpPost]
        //public JsonResult SetGsRate(double rate)
        //{
        //    return Json(new {});
        //}

        //public JsonResult CheckUser()
        //{
        //    if (Profile.IsAuthenticated)
        //    {
        //        return Json(new
        //                        {
        //                            Avatar = Profile.CurrentUser.Avatar,
        //                            Description = Profile.CurrentUser.Description,
        //                            NickName = Profile.CurrentUser.NickName,
        //                            Id = Profile.CurrentUser.Id,
        //                            Email = Profile.CurrentUser.Email
        //                        }, JsonRequestBehavior.AllowGet);
        //    }
        //    return null;
        //}
    }
}
