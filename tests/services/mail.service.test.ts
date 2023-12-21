import MailService from '../../src/services/mail.service';

// Mock nodemailer.Transporter
jest.mock('nodemailer');

describe('MailService', () => {
  let mailService: MailService;

  describe('sendMail', () => {
    it('should send an email successfully', async () => {
      // Arrange
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const html = '<p>Test Content</p>';
      const mockedTransporter = {
        sendMail: jest.fn((_, callback) => callback()),
      };
      mailService = new MailService(mockedTransporter as any);
      // Act
      await mailService.sendMail(to, subject, html);

      // Assert
      expect(mailService['transporter'].sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: process.env.SMTP_FROM,
          to,
          subject,
          html,
        }),
        expect.any(Function),
      );
    });

    it('should reject with an error if sending email fails', async () => {
      // Arrange
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const html = '<p>Test Content</p>';

      // Mock the sendMail function to simulate an error
      const mockedTransporter = {
        sendMail: jest.fn((_, callback) => callback(new Error('Test Error'))),
      };
      mailService = new MailService(mockedTransporter as any);

      // Act & Assert
      await expect(mailService.sendMail(to, subject, html)).rejects.toThrow();
    });
  });

  describe('sendConfirmationEmail', () => {
    it('should send a confirmation email successfully', async () => {
      // Arrange
      const to = 'test@example.com';
      const code = '123456';

      // Mock sendMail to capture the arguments
      mailService.sendMail = jest.fn();

      // Act
      await mailService.sendConfirmationEmail(to, code);

      // Assert
      expect(mailService.sendMail).toHaveBeenCalledWith(to, 'Vui lòng xác minh email của bạn', expect.any(String));
    });
  });

  describe('sendRecoveryPasswordEmail', () => {
    it('should send a recovery password email successfully', async () => {
      // Arrange
      const to = 'test@example.com';
      const code = '654321';

      // Mock sendMail to capture the arguments
      mailService.sendMail = jest.fn();

      // Act
      await mailService.sendRecoveryPasswordEmail(to, code);

      // Assert
      expect(mailService.sendMail).toHaveBeenCalledWith(to, 'Mã xác nhận đổi mật khẩu', expect.any(String));
    });
  });
});
