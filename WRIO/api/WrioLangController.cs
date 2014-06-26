using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using Core.Domain;
using Core.Domain.MySql;

namespace WRIO.api
{
    public class WrioLangController : ApiController
    {
        private readonly MySqlCoreService service;

        public WrioLangController()
        {
            var conn = ConfigurationManager.ConnectionStrings["MySqlWrioCore"].ConnectionString;
            service = new MySqlCoreService(conn);
        }
        // GET api/wriolang
        public IEnumerable<MySqlModel.WrioLanguage> Get()
        {
            return service.GetWrioLanguages();
        }
    }
}
