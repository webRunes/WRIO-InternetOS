using System;
using System.Collections.Generic;
using System.Net.Mail;
using Login.Business.Authorization;
using Login.Services;


namespace WRIO.Models.Login
{
    public class UserLoginModel
    {
        public UserLoginModel()
        {
            AccountCollection = new List<Account>();
        }

        

        public UserLoginModel(List<Account> accountCollectiom)
        {
            AccountCollection = accountCollectiom;
        }

        public UserLoginModel(Profile profile)
        {
            var user = profile.CurrentUser;
            UserName = user.NickName;
            Email = user.Email;
            Avatar = user.Avatar;
            AccountCollection = profile.AccountCollection;
            
            //AccountEmail = profile.GetContextAccountBy(Email).Email;
        }

        public List<Account> AccountCollection { get; set; }

        public string Avatar { get; set; }
         
        public string UserName { get; set; }

        //[AllowHtml] 
        public string Email { get; set; }
        //[AllowHtml] 
        public string Password { get; set; }

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
        //Validators!!!
        //public bool IsEmptyUser { get; set; }

        private bool _isValidEmail;
        public bool IsValidEmail
        {
            get
            {
                if (!string.IsNullOrEmpty(Email))
                {
                    try
                    {
                        var m = new MailAddress(Email);
                        _isValidEmail = true;
                    }
                    catch
                    {
                        _isValidEmail = false;
                    }
                }
                return _isValidEmail;
            }
            set { _isValidEmail = value; }
        } //
        
        private bool _isValidPassword;
        public bool IsValidPassword
        {
            get
            {
                if (!string.IsNullOrEmpty(Password))
                {
                    _isValidPassword = true;
                }
                return _isValidPassword;
            }
            set { _isValidPassword = value; }
        } //

        public bool ForgotPassword { get; set; }
        //Tabs to open!!!

        public bool IsPasswordRequired { get; set; }
        public bool ResetPassword { get; set; }

        public bool IsEmailRequired { get; set; }

        public bool IsSignUpTab { get; set; }
        public bool SignUpEmailIsIncorrect { get; set; }
        public bool SignUpPasswordIsIncorrect { get; set; }

        public bool IsEmailExist { get; set; }

        private string _accountEmail = string.Empty;
        public string AccountEmail
        {
            get { return _accountEmail; }
            set { _accountEmail = value; }
        }
        
    }
}