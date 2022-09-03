using Microsoft.AspNetCore.Mvc;
using SignalRMiniChatApp.Models;
using System.Diagnostics;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using SignalRMiniChatApp.Data;

namespace SignalRMiniChatApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            var clients=ClientSource.Clients;
            ViewBag.groups = GroupSource.Groups;
            return View(clients);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}