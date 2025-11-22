using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MIIO.Migrations
{
    /// <inheritdoc />
    public partial class actualizacionclaseordenes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "orders");
        }
    }
}
