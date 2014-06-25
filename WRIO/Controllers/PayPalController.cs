using System.Configuration;
using System.Web.Mvc;
using WRIO.Extensions;
using webGold.Services;

namespace WRIO.Controllers
{
    public class PayPalController : CustomControllerBase
    {
        public ActionResult PayPalResponse()
        {
            string token = HttpContext.Request.Params["token"];
            var payerId = HttpContext.Request.Params["PayerID"];
            var strResult = PayPalService.ResponseResult(token, payerId);
            var redirectUrl = ConfigurationSettings.AppSettings["WEBRUNES_WALLET_REDIRECT_URL"];

            return Redirect(string.Concat(redirectUrl, strResult));
        }
    }
}
