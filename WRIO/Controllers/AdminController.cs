using System.Web.Mvc;
using WRIO.Extensions;

namespace WRIO.Controllers
{
    public class AdminController : CustomControllerBase
    {
        //
        // GET: /Admin/
        
        public ActionResult AdminLogin(string name,string password)
        {
            if (IsLogin())
            {
                return View("AdminMain"); 
            }
            if (!string.IsNullOrEmpty(name) || !string.IsNullOrEmpty(password))
            {
                Session["IsAdmin"] = true;
                return RedirectToAction("AdminMain");
            }
            return View("AdminLogin");
        }
        //AdminMain //TransactionList
        public ActionResult AdminMain()
        {
            ActionResult adminMain;
            if (IsLogin()) return View("AdminMain"); ;
            return RedirectToAction("AdminLogin");
        }

        public ActionResult TransactionList()
        {
            if (!IsLogin()) return View("AdminMain");
           // var transactionList = PaymentService.GetTransactionCollection();

            return View("TransactionList"/*, transactionList*/);
        }
        private bool IsLogin()
        {
            var val = Session["IsAdmin"];
            if (val != null)
            {
                if ((bool) val)
                {
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
