using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using Core.Domain;
using Core.Domain.MySql;

namespace WRIO.api
{
    public class CorePostsController : ApiController
    {
        private readonly MySqlCoreService service;

        public CorePostsController()
        {
            var conn = ConfigurationManager.ConnectionStrings["MySqlWrioCore"].ConnectionString;
            service = new MySqlCoreService(conn);
        }

        // GET api/coretickets/guid
        public MySqlModel.Post Get(Guid id)
        {
            return service.GetPostByGuid(id);
        }

        // POST api/coretickets get posts
        public TicketData Post([FromBody]TicketData data)
        {
            return new TicketData
                {
                    Tickets = service.GetPostByHubTagPagination(data.Page, data.PageCount, data.PageTag, data.AuthorGuid),
                    Count = service.GetPostsCountByHubTag(data.PageTag, data.AuthorGuid)
                };
        }

        // PUT api/coretickets/5 insert-edit post
        public MySqlModel.Post Put(Guid id, [FromBody]MySqlModel.Post post)
        {
            return service.SavePost(post, "en-US");
        }

        // DELETE api/coretickets/5
        public bool Delete(int id)
        {
            return service.DeletePost(id);
        }

        public class TicketData
        {
            public IEnumerable<MySqlModel.Post> Tickets { get; set; }
            public int Count { get; set; }
            public int Page { get; set; }
            public int PageCount { get; set; }
            public string PageTag { get; set; }
            public string AuthorGuid { get; set; }
        }
    }
}
