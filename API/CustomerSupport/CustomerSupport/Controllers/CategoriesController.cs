using CustomerSupport.Services;
using Microsoft.AspNetCore.Mvc;

namespace CustomerSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : Controller
    {
        private readonly CategoriesService _categoriesService;

        public CategoriesController(CategoriesService categoriesService)
        {
            _categoriesService = categoriesService;
        }

        [HttpGet]
        public List<string> GetCategories()
        {
            var categories = _categoriesService.GetCategories();
            Console.WriteLine("Kategorije" + categories);

            return categories.ToList();
        }
    }
}
