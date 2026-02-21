using noava.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace noava.Models
{
    public class User
    {
        [Key]
        public string ClerkId { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.USER;
        public bool ReceiveNotificationEmails { get; set; } = true;
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<ClassroomUser> ClassroomUsers { get; set; } = new List<ClassroomUser>();
    }
}