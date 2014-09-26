using System;
using System.Configuration;
using System.Net;
using System.Net.Mail;

namespace WRIO.Extensions
{
    public class EmailWorker
    {
        readonly MailerSettingsExtensions config = (MailerSettingsExtensions)ConfigurationManager.GetSection("mailerSettings");

        public bool SendEmail(string to, string subj, string body)
        {
            var mail = new MailMessage();
            mail.From = new MailAddress(config.EmailName);
            mail.To.Add(new MailAddress(to));
            mail.Subject = subj;
            mail.Body = body;

            var client = new SmtpClient(config.Host, config.Port)
            {
                UseDefaultCredentials = false,
                EnableSsl = true,
                Credentials = (ICredentialsByHost)new NetworkCredential(config.AccountName, config.Password)
            };
            try
            {
                client.Send(mail);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }

    public class MailerSettingsExtensions : ConfigurationSection
    {
        [ConfigurationProperty("email", IsRequired = true)]
        public string EmailName
        {
            get { return (string) this["email"]; }
            set { this["email"] = value; }
        }

        [ConfigurationProperty("account", IsRequired = true)]
        public string AccountName
        {
            get { return (string) this["account"]; }
            set { this["account"] = value; }
        }

        [ConfigurationProperty("port", IsRequired = true)]
        public int Port
        {
            get { return (int) this["port"]; }
            set { this["port"] = value; }
        }

        [ConfigurationProperty("host", IsRequired = true)]
        public string Host
        {
            get { return (string) this["host"]; }
            set { this["host"] = value; }
        }

        [ConfigurationProperty("password", IsRequired = true)]
        public string Password
        {
            get { return (string) this["password"]; }
            set { this["password"] = value; }
        }
    }
}