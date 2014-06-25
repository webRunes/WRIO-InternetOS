using System.Collections.Generic;
using PaymentHistory = webGold.Repository.Entity.PaymentHistory;

namespace WRIO.Models.Admin
{
    public class TransactionCollectionModel
    {
        public List<PaymentHistory> PaymentCollection { get; set; }
    }
}