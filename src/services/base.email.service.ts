import nodemailer, { Transporter, TransportOptions } from 'nodemailer'
import IEmailService, { EmailServiceConfig, EmailMessage } from '../interfaces/email.service.interface';

export class BaseEmailService implements IEmailService {
    private transporter: Transporter;

    constructor(private config: EmailServiceConfig) {
        this.transporter = nodemailer.createTransport(config as TransportOptions);
    }

    public async sendMail(message: EmailMessage) { 
        let options = { 
            from: message.from, 
            to: message.to, 
            subject: message.subject,
            priority: message.priority,
            text: message.body,
            html: message.html,
            attachments: message.attachments
        }
 
        try {
            await this.transporter.sendMail(options); 
        } catch (error) {
            const message = "Something went wrong while sending email";
            console.error(`${message}: ${error}`);
            throw new Error(message);
        }
      } 
}
