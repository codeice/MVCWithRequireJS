using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CE.PortalWeb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult MatchDetail()
        {
            return View();
        }

        /// <summary>
        /// 下载App
        /// </summary>
        /// <returns></returns>
        public ActionResult AppDownload()
        {
            return View();
        }

    }
}