using System.Configuration;
using System.Linq;
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
            var hostingEndPoint = ConfigurationManager.AppSettings["HOSTING_ENDPOINT"];
            var webGoldUrlParams = ConfigurationManager.AppSettings["WEBRUNES_WEBGOLD_PARAMS"];
            var error = ConfigurationManager.AppSettings["WEBRUNES_WEBGOLD_ERROR"];
            var succes = ConfigurationManager.AppSettings["WEBRUNES_WEBGOLD_SUCCES"];
            string resultUrl = string.Concat(hostingEndPoint, webGoldUrlParams);
            resultUrl = string.Concat(resultUrl, strResult.IsSucces ? succes : error);
            return Redirect(resultUrl);
        }
    }
}
