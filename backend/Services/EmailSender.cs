using backend.Models;
using backend.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace backend.Services
{
    public class EmailSender : IEmailSender
    {
        public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public AuthMessageSenderOptions Options { get; }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            await Execute(subject, message, toEmail);
        }

        public async Task Execute(string subject, string message, string toEmail)
        {
            try
            {
                using var mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(Options.FromEmail, Options.FromName);
                mailMessage.To.Add(new MailAddress(toEmail));
                mailMessage.Subject = subject;
                mailMessage.Body = message;
                mailMessage.IsBodyHtml = true;
                mailMessage.Priority = MailPriority.Normal;

                using var client = new SmtpClient(Options.SmtpHost, Options.SmtpPort);
                client.EnableSsl = Options.EnableSsl;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(Options.SmtpUsername, Options.SmtpPassword);

                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to send email", ex);
            }
        }
    }
}
