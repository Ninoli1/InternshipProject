using Microsoft.Extensions.Configuration;

namespace CustomerSupport.Services
{
    public class CategoriesService
    {
        private readonly IConfiguration _configuration;

        public CategoriesService(IConfiguration configuration )
        {
            _configuration = configuration;
            
        }

        public string[] GetCategories() {
            

           var categories= _configuration
            .GetSection("categories")
            .GetChildren()
            .Select(x => x.Value)
            .ToArray();

            return categories;

        }
    }
}
