using System.ComponentModel.DataAnnotations;

namespace MIIO.Models
{
    public class Product
    {
        public Product() { }

        // Id, Name, Material, Category, Price, Offer, Image, Description
        public Product(int id, string name, string description, string category
            , string material, string image, int price, Boolean offer) { 
            Id = id;
            Name = name;
            Description = description;
            Category = category;
            Material = material;
            Image = image;
            Price = price;
            Offer = offer;
        }
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        public string Material { get; set; }
        public string Image { get; set; }
        [Required]
        public int Price { get; set; }
        public Boolean Offer { get; set; }

    }
}
