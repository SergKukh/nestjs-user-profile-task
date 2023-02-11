import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ClientRoutes } from '@constants/routes';
import confirmEmailTemplate from './templates/confirmEmail';
import { confirmEmailSubject } from './constants';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendConfirmEmail(email: string, key: string): Promise<void> {
    try {
      const url = `${
        this.configService.get('URL') + ClientRoutes.CONFIRM_EMAIL
      }/${key}`;

      await this.sendMail(
        email,
        confirmEmailSubject,
        confirmEmailTemplate(url),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  private async sendMail(
    email: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
