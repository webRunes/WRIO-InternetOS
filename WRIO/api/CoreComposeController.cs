using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using Core.Domain;
using Core.Domain.MySql;

namespace WRIO.api
{
    public class CoreComposeController : ApiController
    {
        private readonly MySqlCoreService service;

        public CoreComposeController()
        {
            var conn = ConfigurationManager.ConnectionStrings["MySqlWrioCore"].ConnectionString;
            service = new MySqlCoreService(conn);
        }

        // GET api/corecompose/5
        public IEnumerable<MySqlModel.Compose> Get(Guid id)
        {
            return service.GetUserComposes(id);
        }

        // PUT api/corecompose/5
        public MySqlModel.Compose Put(Guid id, [FromBody]MySqlModel.Compose compose)
        {
            return service.SaveCompose(compose);
        }

        // DELETE api/corecompose/5
        public bool Delete(int id)
        {
            return service.DeleteCompose(id);
        }
    }
}
