export interface EmailServiceConfig {
    service: string
    auth: {
        user: string
        pass: string
    }
}

export interface EmailAttachment {
    filename: string,
    path: string
}

export interface EmailMessage {
    from: string
    to: string | string[],
    priority?: "high"|"normal"|"low",
    subject: string, 
    body?: string,
    html?: string,
    attachments?: EmailAttachment[]
}

export default interface IEmailService {
    sendMail(message: EmailMessage): Promise<void>;
}