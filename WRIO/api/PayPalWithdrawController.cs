using System;
using System.Text;
using System.Web.Http;
using PayPal.PayPalAPIInterfaceService.Model;
using WRIO.Extensions;
using WRIO.Models;
using webGold.Business;
using webGold.Services;


namespace WRIO.api
{
    public class PayPalWithdrawController : CustomApiController
    {
        // POST api/paypalwithdraw
        public WithdrawModel Post([FromBody]WithdrawModel model)
        {
            double amountDouble = Converter.ParseToDouble(model.Amount);
            var currentUserId = Profile.CurrentUser.Id;
            if (amountDouble > 100)
            {
                amountDouble = 100;
            }
            else
            {
                if (amountDouble < 5)
                {
                    model.IsTransferCanseled = true;
                    model.ErrorType = WRIO.Models.ErrorType.minimumLimit.ToString();
                    return model;
                }
            }
            var ammountByLastDay = AccountBalanceService.TransferPorLastDay(currentUserId);
            if (ammountByLastDay >= 100 - 5)
            {
                model.IsTransferCanseled = true;
                //add message!!!
                model.ErrorType = WRIO.Models.ErrorType.dayLimit.ToString();
                //model.ErrorMessage = "";
                return model;
            }
            if (ammountByLastDay + amountDouble > 100)
            {
                model.IsTransferCanseled = true;
                model.ErrorType = WRIO.Models.ErrorType.dayLimit.ToString();
                //add message!!!
                return model;
            }

            var accountEntity = AccountManager.GetAccountBy(Profile.CurrentUser.Id);
            if (accountEntity.UsdAmount < amountDouble)
            {
                model.IsTransferCanseled = true;
                model.ErrorType = WRIO.Models.ErrorType.haventMoney.ToString();
                return model;
            }
            string currencyCodeValue = "USD";

            string receiverInfoType = string.Empty;
            if (!string.IsNullOrEmpty(model.Email))
            {
                receiverInfoType = ReceiverInfoCodeType.EMAILADDRESS.ToString();
            }
            string email = model.Email;
            var entity = new webGold.Repository.Entity.PayPal
                         {
                             Id = Guid.NewGuid().ToString(),
                             CurrencyCode = currencyCodeValue,
                             Amount = amountDouble,
                             ReceiverInfoType = receiverInfoType,
                             CreateTime = DateTime.UtcNow,
                             PayerEmail = Profile.CurrentUser.Email,
                             UserId = currentUserId,
                             InternalPaymentId =
                                 Guid.NewGuid().ToString().Substring(0, 30)
                         };
            PayPalService.Withdraw(entity, email);
            //Send email
            var emailText = new StringBuilder();
            emailText.AppendFormat("User ID : {0} </br>", accountEntity.UserId);
            emailText.AppendFormat("E-mail : {0} </br>", email);
            emailText.AppendFormat("Amount : {0} </br>", model.Amount);
            var emailWorker = new EmailWorker();
            emailWorker.SendEmail(email, "PayPal Withdraw", emailText.ToString());
            return model;
        }
    }
}
