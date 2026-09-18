using System.ComponentModel.DataAnnotations;

namespace HCManagement.Core.Features.Users;

public class User
{
    #region Properties
    [Key]
    public int Id { get; private set; }

    [Required]
    [StringLength(UserContracts.UserNameMaxLength)]
    public required string UserName { get; set; }

    [Required]
    [StringLength(255)]
    public required string PasswordHash { get; set; }

    public DateTime? DeletedDateTime { get; set; }
    #endregion
}

