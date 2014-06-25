using System.Collections.Generic;
using WRIO.Extensions;
using WRIO.Models;
using webGold.Services;


namespace WRIO.api
{
    public class WalletsController : CustomApiController
    {
        public List<WalletModel> Get()
        {
            var historyCollection = AccountBalanceService.PaymentHistoryCollection(Profile.CurrentUser.Id);
            return WalletModel.GetWalletCollection(historyCollection);
        }
        public string Get(int id)
        {
            return "value";
        }
    }
}
