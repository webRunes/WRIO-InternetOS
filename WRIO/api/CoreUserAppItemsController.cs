using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using Core.Domain;
using Core.Domain.MySql;

namespace WRIO.api
{
    public class CoreUserAppItemsController : ApiController
    {
        private readonly MySqlCoreService service;

        public CoreUserAppItemsController()
        {
            var conn = ConfigurationManager.ConnectionStrings["MySqlWrioCore"].ConnectionString;
            service = new MySqlCoreService(conn);
        }

        // GET api/coreuserappitems/5
        public IEnumerable<MySqlModel.UserAppItem> Get(int id)
        {
            return new List<MySqlModel.UserAppItem>();
        }

        // PUT api/coreuserappitems/5
        public int Put(int id, [FromBody]MySqlModel.UserAppItem value)
        {
            return service.InsertUserAppItem(value);
        }

        // DELETE api/coreuserappitems/5
        public void Post([FromBody]MySqlModel.UserAppItem value)
        {
            service.DeleteUserAppItem(value);
        }
    }
}
