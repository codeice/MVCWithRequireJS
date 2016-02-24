using System.Web.Mvc;
using Microsoft.Owin.Security.Facebook;

namespace CE.PortalWeb.Controllers
{
    /// <summary>
    /// 报名
    /// </summary>
    public class SignUpController : Controller
    {
        /// <summary>
        /// 个人报名
        /// </summary>
        /// <returns></returns>
        public ActionResult Apply()
        {
            return View();
        }


        /// <summary>
        /// 报名信息确认
        /// </summary>
        /// <returns></returns>
        public ActionResult Confirm()
        {
            return View();
        }

        /// <summary>
        /// 支付报名费用
        /// </summary>
        /// <returns></returns>
        public ActionResult Pay()
        {
            return View();
        }

        /// <summary>
        /// 报名完成
        /// </summary>
        /// <returns></returns>
        public ActionResult Complete()
        {
            return View();
        }

        /// <summary>
        /// 我的报名
        /// </summary>
        /// <returns></returns>
        public ActionResult MyRegistration()
        {
            return View();
        }


    }
}