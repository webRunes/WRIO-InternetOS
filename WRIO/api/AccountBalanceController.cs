using Login.Services.Extention;
using WRIO.Extensions;
using webGold.Business.Model;
using webGold.Services;

namespace WRIO.api
{
    public class AccountBalanceController : CustomApiController
    {
        [CustomAuthorize]
        public AccountBalanceModel Post()
        {
            return AccountBalanceService.GetUserBalance(Profile.CurrentUser.Id);
        }
    }
}
