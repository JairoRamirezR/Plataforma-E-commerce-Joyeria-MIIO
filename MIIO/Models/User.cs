using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace MIIO.Models
{
    public class User : IdentityUser
    {
        //Id, Name, LastName, Email, BirthDay, Address, Password
        [Required]
        public string Name { get; set; }
        [Required]
        public string LastName { get; set; }
        public DateOnly BirhDay { get; set; }
        [Required]
        public string Address { get; set; }
    }
}
