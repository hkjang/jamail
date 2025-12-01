import { SmtpService } from '../smtp/smtp.service';
export declare class MailService {
    private smtpService;
    constructor(smtpService: SmtpService);
    sendEmail(to: string, subject: string, html: string, category?: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
