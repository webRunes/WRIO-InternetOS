using webGold.Business.Model;
using webGold.Services;
using WRIO.Extensions;

namespace WRIO.api
{
    public class LastTransactionController : CustomApiController
    {
        public AccountBalanceModel Post()
        {
            return PayPalService.GetLastTransaction(Profile.CurrentUser.Id);
        }
    }
}
