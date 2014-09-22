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

            var id = Profile.LoginBySocialNT(token);

            return Json(new { UserId = id }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public bool LogOut(Guid id)
        {
            return Profile.LogOut(id);
        }
    }
}
