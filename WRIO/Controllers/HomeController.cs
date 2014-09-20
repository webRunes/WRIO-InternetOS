using System;
using System.Web.Mvc;
using Core.Domain;
using WRIO.Extensions;

namespace WRIO.Controllers
{
    public class HomeController : CustomControllerBase
    {
        private readonly MySqlCoreService service;

        public HomeController()
        {
            service = new MySqlCoreService(Connection);
        }

        //
        // GET: /Home/
        public ActionResult Index(string id)
        {
            var postId = id ?? "";
            var title = "";
            var description = "";
            var image = "";

            if (!Profile.IsAuthenticated)
            {
                Guid guid;
                if (!Guid.TryParse(id, out guid))
                {
                    guid = Guid.Empty;
                }

                var ticket = service.GetPostByGuid(guid);
                if (ticket != null)
                {
                    title = ticket.Title;
                    description = ticket.Description;
                    image = ticket.Picture;
                }
            }
            var user = Profile.IsAuthenticated ? Profile.GetUserAccountGuid() : "";

            ViewBag.postId = postId;
            ViewBag.title = title;
            ViewBag.description = description;
            ViewBag.image = image;
            ViewBag.user = user;
            return View();
        }
    }
}
