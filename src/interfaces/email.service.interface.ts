import { EmailMessage } from "../services/base.email.service";

export default interface IEmailService {
    sendMail(message: EmailMessage): Promise<void>;
}