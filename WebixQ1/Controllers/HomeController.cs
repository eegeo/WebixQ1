using Microsoft.AspNetCore.Mvc;
using WebixQ1.Models;

namespace WebixQ1.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Users()
        {
            return Ok(new object[] { new { id = 1, lastName = "Jhon", firstName = "Smith" } } );
        }
        
        public IActionResult UserCreate(UserModel model)
        {
            if (model.LastName == "LogicError")
            {
                return Ok(new { errors = "The user cannot be created!" });
            }
            else
            {
                if (model.LastName == "ServerError")
                {
                    return BadRequest();
                }
                else
                {
                    var rnd = new Random();
                    return Ok(new { errors = "", newId = rnd.Next(1, 100) });
                }
            }                       
        }

        public IActionResult UserUpdate(UserModel model)
        {
            if (model.LastName == "LogicError")
            {
                return Ok(new { errors = "The user cannot be created!" });
            }
            else
            {
                if (model.LastName == "ServerError")
                {
                    return BadRequest();
                }
                else
                {
                    return Ok();
                }
            }
        }

        public IActionResult DeleteUpdate(int id)
        {
            return Ok(new { errors = "The user cannot be deleted!" });
        }
    }
}