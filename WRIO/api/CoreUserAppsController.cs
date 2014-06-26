using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using Core.Domain;
using Core.Domain.MySql;

namespace WRIO.api
{
    public class CoreUserAppsController : ApiController
    {
        private readonly MySqlCoreService service;

        public CoreUserAppsController()
        {
            var conn = ConfigurationManager.ConnectionStrings["MySqlWrioCore"].ConnectionString;
            service = new MySqlCoreService(conn);
        }

        // GET api/userapps/user
        public IEnumerable<MySqlModel.UserApp> Get(Guid id)
        {
            var apps = service.GetUserApps(id);
            return apps;
        }

        // POST api/userapps
        public void Post([FromBody]string value)
        {
        }

        // PUT api/userapps/5
        public MySqlModel.UserApp Put(Guid id, [FromBody]MySqlModel.UserApp app)
        {
            app.Added = DateTime.Now;
            return service.InsertUserApp(app);
        }

        // DELETE api/userapps/5
        public void Delete(int id)
        {
        }
    }
}
