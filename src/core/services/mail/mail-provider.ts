interface MailProvider {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}
export default MailProvider;
