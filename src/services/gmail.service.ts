import { BaseEmailService } from "./base.email.service";
import { INVOICE_EMAIL_SENDER_PASSWORD, INVOICE_EMAIL_SENDER_ADDRESS } from '../../config';

class GmailService extends BaseEmailService {
    constructor() {
        super({
                service: "Gmail",
                auth: {
                    user: INVOICE_EMAIL_SENDER_ADDRESS!,
                    pass: INVOICE_EMAIL_SENDER_PASSWORD!
                }
            }
        );
    }
}

export default new GmailService();

