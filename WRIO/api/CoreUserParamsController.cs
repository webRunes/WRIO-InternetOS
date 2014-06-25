using System;
using System.Configuration;
using System.Web.Http;
using Core.Domain;
using Core.Domain.MySql;

namespace WRIO.api
{
    public class CoreUserParamsController : ApiController
    {
        private readonly MySqlCoreService service;

        public CoreUserParamsController()
        {
            var conn = ConfigurationManager.ConnectionStrings["MySqlWrioCore"].ConnectionString;
            service = new MySqlCoreService(conn);
        }
        // GET api/coreuserparams
        public MySqlModel.UserParams Get(Guid id)
        {
            return service.GetUserParams(id.ToString());
        }

        // POST api/coreuserparams
        public MySqlModel.UserParams Post([FromBody]MySqlModel.UserParams model)
        {
            return service.UpdateUsedLangs(model);
        }

        // PUT api/coreuserparams/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/coreuserparams/5
        public void Delete(int id)
        {
        }
    }
}
