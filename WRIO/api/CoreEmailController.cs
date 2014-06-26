using System.Web.Http;
using WRIO.Extensions;

namespace WRIO.api
{
    public class CoreEmailController : ApiController
    {
        // POST api/coreemail
        public bool Post([FromBody]EmailMsg message)
        {
            var worker = new EmailWorker();
            return worker.SendEmail(message.To, message.Subj, message.Body);
        }

        public class EmailMsg
        {
            public string To { get; set; }
            public string Subj { get; set; }
            public string Body { get; set; }
        }

    }
}
