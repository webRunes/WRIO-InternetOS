using System.Configuration;
using System.Web.Mvc;
using Core.Domain;
using Titter;
using WRIO.Extensions;

namespace WRIO.Controllers
{
    public class TitterController : CustomControllerBase
    {
        private readonly string cunsomerKey = ConfigurationManager.AppSettings["TwitterKey"];
        private readonly string cunsomerSecret = ConfigurationManager.AppSettings["TwitterSecret"];
        private readonly string conn = ConfigurationManager.ConnectionStrings["MySqlWrioCore"].ConnectionString;
        private readonly MySqlCoreService service;

        public TitterController()
        {
            service = new MySqlCoreService(conn);
        }

        public JsonResult Login(string id)
        {
            Session["twitter_callback_guid"] = id;
            var titter = new TitterService(cunsomerKey, cunsomerSecret);

            return Json(titter.GetRequestToken(), JsonRequestBehavior.AllowGet); 
        }

        public ActionResult Oauth()
        {
            var id = "";
            if (Session["twitter_callback_guid"] != null) id = Session["twitter_callback_guid"].ToString();
            var denied = Request.Params["denied"];
            var oauth_token = Request.Params["oauth_token"];
            var oauth_verifier = Request.Params["oauth_verifier"];

            if (string.IsNullOrEmpty(denied) && !string.IsNullOrEmpty(oauth_token) && !string.IsNullOrEmpty(oauth_verifier))
            {
                var titter = new TitterService(cunsomerKey, cunsomerSecret);
                var token = titter.GetOauthToken(oauth_verifier, oauth_token);
                if (token != null && Profile.IsAuthenticated && !string.IsNullOrEmpty(Profile.CurrentUser.Id))
                {
                    token.UserGuid = Profile.CurrentUser.Id;
                    service.SaveUserTwitterToken(TwitterToken.ConvertToken(token));
                }
            }
            
            return RedirectToAction("Index", "Home", new { id });
        }

        [HttpGet]
        public JsonResult Twitter(string id)
        {
            var twitter = service.GetUserTwitterToken(id);

            return Json(twitter != null, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SendTweet(TweetPost post)
        {
            var status = "403";
            var token = service.GetUserTwitterToken(post.UserGuid);

            if (token != null)
            {
                var titter = new TitterService(cunsomerKey, cunsomerSecret);
                status = titter.SendMessage(token.OauthToken, token.OauthTokenSecret, post.Title, post.Description);
            }
            return Json(new{status}, JsonRequestBehavior.AllowGet);
        }

        public class TweetPost
        {
            public string UserGuid { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Wrg { get; set; }
            public string PostGuid { get; set; }
        }
    }
}
