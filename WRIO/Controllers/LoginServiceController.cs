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
    }
}
