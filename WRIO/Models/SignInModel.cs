using System.Net.Mail;

namespace WRIO.Models
{
    using System;
    using System.Text.RegularExpressions;

    public class SignInModel
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public bool Remember { get; set; }

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
        } 

        private bool _isValidPassword;
        ////@"!@#$%^&*()_-+=;',.?/:\][", 
        public bool IsValidPassword
        {
            get
            {
                if (!string.IsNullOrEmpty(Password) && Password.Length <= 32)
                {
                    try
                    {
                         if (Regex.Match(Password, @"(\w|[!@#$%^&*()_:[]])", RegexOptions.IgnoreCase).Success)
                         {
                             _isValidPassword = true;
                             return true;
                         }
                    }
                    catch (Exception)
                    {
                        _isValidPassword = false;
                        throw;
                    }
                    _isValidPassword = false;
                }
                return _isValidPassword;
            }
            set { _isValidPassword = value; }
        }
    }
}