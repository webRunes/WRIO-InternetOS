using System.Web;
using System.Web.Mvc;
using Login.Services;
using TagLang.Business;

namespace WRIO.Extensions
{
    public class CustomControllerBase : Controller
    {
        public new HttpContextBase HttpContext
        {
            get
            {
                var context =
                    new HttpContextWrapper(System.Web.HttpContext.Current);
                return (HttpContextBase)context;
            }
        }

        private Login.Services.Profile _profile;
        public new Login.Services.Profile Profile
        {
            get { return _profile ?? (_profile = new Login.Services.Profile(HttpContext.ApplicationInstance.Context)); }
        }

        //[AcceptVerbs(HttpVerbs.Post)]
        //public JsonResult Translation(string[] keys)
        //{
        //    var service = new TagLangService();
        //    return Json(service.Translate(keys, Profile.CurrentCulture));
        //}
    }
}