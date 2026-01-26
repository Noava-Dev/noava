namespace noava.Models
{
    public class School
    {
        public int Id { get; set; }
        public string Name { get; set;}
        public string? Description { get; set; }

        //a collection of schooladmins or a collection of users with the role school admin?
        public Icollection<SchoolAdmin> Admins { get; set;} = new List<SchoolAdmin>();

        //dateTime could be added here but is it necessary?
    }
   
}