using backend.Services.Interfaces;

namespace backend.Services
{
    public class NoopEmailSender : IEmailSender
    {
        public Task SendEmailAsync(string toEmail, string subject, string message) => Task.CompletedTask;
    }
}