using System.Web.Http;
using WRIO.Extensions;
using webGold.Business.Model;
using webGold.Services;

namespace WRIO.api
{
    public class PayPalController : CustomApiController
    {
        public PayPalResponseResultModel Post(int id, [FromBody]string amount)
        {
            var curUser = Profile.CurrentUser;
            return PayPalService.SendRequest(this.HttpContext, amount, curUser.Id, curUser.Email);
        }
    }
}
