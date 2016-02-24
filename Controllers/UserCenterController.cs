using System.Web.Mvc;

namespace CE.PortalWeb.Controllers
{
    public class UserCenterController : Controller
    {

        /// <summary>
        /// 我的订单
        /// </summary>
        /// <returns></returns>
        public ActionResult MyOrder()
        {
            return View();
        }

        /// <summary>
        /// 我的赛事
        /// </summary>
        /// <returns></returns>
        public ActionResult MyEvents()
        {
            return View();
        }

        /// <summary>
        /// 个人资料
        /// </summary>
        /// <returns></returns>
        public ActionResult UserProfile()
        {
            return View();
        }

        /// <summary>
        /// 我的成绩
        /// </summary>
        /// <returns></returns>
        public ActionResult MyScore()
        {
            return View();
        }

        /// <summary>
        /// 我的联系人
        /// </summary>
        /// <returns></returns>
        public ActionResult MyContacts()
        {
            return View();
        }

        /// <summary>
        /// 添加/编辑联系人
        /// </summary>
        /// <returns></returns>
        public ActionResult ContactForm()
        {
            return View();
        }

        /// <summary>
        /// 修改手机号
        /// </summary>
        /// <returns></returns>
        public ActionResult UpdateCellNumber()
        {
            return View();
        }

    }
}