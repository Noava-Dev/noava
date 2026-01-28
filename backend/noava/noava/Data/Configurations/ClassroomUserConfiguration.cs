using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
{
    public class ClassroomUserConfiguration : IEntityTypeConfiguration<ClassroomUser>
    {
        public void Configure(EntityTypeBuilder<ClassroomUser> builder)
        {
            builder.HasKey(cu => new { cu.ClassroomId, cu.UserId });
            builder.HasOne(cu => cu.Classroom)
                .WithMany(c => c.ClassroomUsers)
                .HasForeignKey(cu => cu.ClassroomId);
            builder.HasOne(cu => cu.User)
                .WithMany(u => u.ClassroomUsers)
                .HasForeignKey(cu => cu.UserId);
            builder.Property(cu => cu.IsTeacher)
                .IsRequired();
        }
    }
}