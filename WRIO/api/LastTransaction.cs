using webGold.Business.Model;
using webGold.Services;
using WRIO.Extensions;

namespace Web.api
{
    public class LastTransaction : CustomApiController
    {
        public AccountBalanceModel Post()
        {
            return PayPalService.GetLastTransaction(Profile.CurrentUser.Id);
        }
    }
}