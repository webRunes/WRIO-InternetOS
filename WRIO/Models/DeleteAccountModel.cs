namespace WRIO.Models
{
    public class DeleteAccountModel
    {
        public string Email { get; set; }

        public string Password { get; set; }
        public string Description { get; set; }

        public bool HasPassword
        {
            get
            {
                if(string.IsNullOrEmpty(Password))
                {
                    return false;
                }
                return true;
            }
        }
        public bool HasEmail
        {
            get
            {
                if(string.IsNullOrEmpty(Email))
                {
                    return false;
                }
                return true;
            }
        }
    }
}