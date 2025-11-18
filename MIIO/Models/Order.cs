using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace MIIO.Models
{
    public class Order
    {
        //Id, Description, TotalAmount, Date, State
        public Order (int id, string description, int totalAmount, DateTime date, string state) { 
            Id = id;
            Description = description;
            TotalAmount = totalAmount;
            Date = date;
            State = state;
        }

        public int Id { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int TotalAmount { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string State { get; set; }
    }
}
