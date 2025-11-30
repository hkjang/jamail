import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SmtpService } from '../smtp/smtp.service';

@Injectable()
export class MailService {
    constructor(private smtpService: SmtpService) { }

    async sendEmail(to: string, subject: string, html: string, category?: string) {
        // Select appropriate SMTP config based on category
        const smtpConfig = await this.smtpService.selectSmtpConfig(category);

        if (!smtpConfig) {
            throw new Error('No SMTP configuration found. Please configure at least one SMTP server.');
        }

        const transporter = nodemailer.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
            auth: {
                user: smtpConfig.username,
                pass: smtpConfig.password,
            },
        });

        const info = await transporter.sendMail({
            from: smtpConfig.username,
            to,
            subject,
            html,
        });

        return info;
    }
}
