namespace MIIO.Models
{
    public class Product
    {
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
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Material { get; set; }
        public string Image { get; set; }
        public int Price { get; set; }
        public Boolean Offer { get; set; }

    }
}
