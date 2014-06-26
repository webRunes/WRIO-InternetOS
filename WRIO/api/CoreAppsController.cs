using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using Core.Domain;
using Core.Domain.MySql;

namespace WRIO.api
{
    public class CoreAppsController : ApiController
    {
        private readonly MySqlCoreService service;

        public CoreAppsController()
        {
            var conn = ConfigurationManager.ConnectionStrings["MySqlWrioCore"].ConnectionString;
            service = new MySqlCoreService(conn);
        }
        // GET api/apptickets/tag
        public MySqlModel.App Get(string id)
        {
            return service.GetAppByTag(id);
        }

        // POST api/apptickets
        public AppTicketData Post([FromBody]AppTicketData data)
        {
            return new AppTicketData
            {
                AppTickets = service.GetAppByPagination(data.Page, data.PageCount),
                Count = service.GetAppsCount()
            };
        }

        public class AppTicketData
        {
            public IEnumerable<MySqlModel.App> AppTickets { get; set; }
            public int Count { get; set; }
            public int Page { get; set; }
            public int PageCount { get; set; }
            public string PageTag { get; set; }
        }
    }
}
