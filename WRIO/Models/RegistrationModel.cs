using System;
using System.Net.Mail;
using Login.Repository;
using Login.Repository.ModelInterfaces;


namespace WRIO.Models
{
    public class RegistrationModel : IRegistrationModel
    {
        public RegistrationModel()
        {
            NickName = "Anonimous";
            Description = "Main profile";
            IsTempUser = true;
        }


        public RegistrationModel(IUserAccount entity)
        {
            NickName = entity.NickName;
            Email = entity.Email;
            Description = entity.Description;
            Avatar = entity.Avatar;
            RegistrationDate = entity.RegistrationDate;
            if(string.IsNullOrEmpty(entity.PasswordHash))
            {
                IsTempUser = true;
            }
        }

       

        public string Id { get; set; }

        public string NickName { get; set; }

        public string Email { get; set; }

        public bool IsEmailCorrect
        {
            get
            {
                if (!string.IsNullOrEmpty(Email))
                {
                    try
                    {
                        var m = new MailAddress(Email);
                        return true;
                    }
                    catch
                    {
                        return false;
                    }
                }
                return false;
            }
        }

        public string Password { get; set; }

        public string Old_Password { get; set; }

        public bool IsPasswordCorrect
        {
            get
            {
                if (!string.IsNullOrEmpty(Password) && Password.Length < 2049)
                {
                    return true;
                }
                return false;
            }
        }

        public string Description { get; set; }

        public string Culture { get; set; }

        public string Avatar { get; set; }

        public DateTime RegistrationDate { get; set; }


        public string StaySignedIn { get; set; }

        public bool IsStaySignedIn
        {
            get
            {
                if (!string.IsNullOrEmpty(StaySignedIn))
                {
                    if (StaySignedIn.Equals("On", StringComparison.InvariantCultureIgnoreCase))
                    {
                        return true;
                    }
                }
                return false;
            }
        }

        public bool IsConfirmationPasswordInCorrect { get; set; }

        public bool IsTempUser { get; set; }

        public bool OpenFirstTab { get; set; }
    }
}