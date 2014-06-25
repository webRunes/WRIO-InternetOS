using System;
using System.Collections.Generic;
using System.Globalization;
using webGold.Repository.Entity;


namespace WRIO.Models
{
    public class WalletModel
    {
        public WalletModel(PaymentHistory entity)
        {
            Amount = GetAmmount(entity.Amount, entity.PaymentMethod);
            Cent = GetCent(entity.Amount);
            Date = entity.Date != null ? entity.Date.ToString("ddd, MMMM dd, yyyy H:mm") : string.Empty;
            Currency = entity.Currency;
            PaymentType = entity.PaymentType;
            PaymentMethod = entity.PaymentMethod;
            Email = entity.ReceivedEmail;
            Status = entity.TransactionStatus.ToLower();
            var tmpStatusView = GetStatusView(Status);
            StatusView = tmpStatusView.Status;
            StatusColor = tmpStatusView.Color;
        }

        private string GetCent(double amount)
        {
            const string nullStr = "0";
            string stringnumber = amount.ToString(CultureInfo.InvariantCulture);
            if (stringnumber.IndexOf(".") != -1)
            {
                return stringnumber.Split('.')[1];
            }
            return nullStr;
        }

        private string GetAmmount(double amount, string paymentMethod)
        {
            string amountTxt;
            string stringnumber = amount.ToString(CultureInfo.InvariantCulture);
            if (stringnumber.IndexOf(".") != -1)
            {
                amountTxt = stringnumber.Split('.')[0];
            }
            else
            {
                amountTxt = stringnumber;
            }
            int paymentMethodValue = Convert.ToInt32(paymentMethod);
            if (paymentMethodValue == (int)webGold.Business.PaymentMethod.Credit)
            {
                amountTxt = string.Format("+{0}", amountTxt);
            }
            else
            {
                amountTxt = string.Format("-{0}", amountTxt);
            }
            return amountTxt;
        }

        public string UserName { get; set; }
        public double GldAmount { get; set; }
        public double UsdAmount { get; set; }

        public string Date { get; set; }
        public string Currency { get; set; }
        public string Amount { get; set; }
        public string PaymentType { get; set; }
        public string PaymentMethod { get; set; }
        public string Email { get; set; }
        public string Status { get; set; }
        public string Cent { get; set; }
        public string StatusView { get; set; }
        public string StatusColor { get; set; }

        public static List<WalletModel> GetWalletCollection(IList<PaymentHistory> historyCollection)
        {
            var walletCollection = new List<WalletModel>();
            foreach (var paymentHistoryEntity in historyCollection)
            {
                walletCollection.Add(new WalletModel(paymentHistoryEntity));
            }
            return walletCollection;
        }

        private StatusView GetStatusView(string status)
        {
            switch (status)
            {
                case "pending":
                    return new StatusView() { Color = "label-warning", Status = "Pending" };//;
                case "success":
                    return new StatusView() { Color = "label-success", Status = "Complete" };//"Complete";
                default:
                    return new StatusView() { Color = "label-important", Status = "Denied" };//"Denied";
            }
        }
    }

    internal class StatusView
    {
        public string Status { get; set; }
        public string Color { get; set; }
    }
}