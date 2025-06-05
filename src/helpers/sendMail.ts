import nodemailer from 'nodemailer';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../config';

export async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: Number(config.email.port),
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"AI-MENTAL-HEALTH-CARE" ${config.email.from}`,
      to: email,
      subject: subject,
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background-color: #f7f9fc;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                color: #1a202c;
                line-height: 1.5;
              }
  
              .email-wrapper {
                max-width: 640px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
                border: 1px solid #e2e8f0;
              }
  
              .email-header {
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                color: #ffffff;
                text-align: center;
                padding: 32px 24px;
                border-bottom: 4px solid #dbeafe;
              }
  
              .email-header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
                letter-spacing: -0.025em;
              }
  
              .email-content {
                padding: 40px 32px;
                font-size: 16px;
                color: #374151;
              }
  
              .email-content p {
                margin: 0 0 20px;
                line-height: 1.7;
              }
  
              .email-button {
                display: inline-block;
                margin-top: 24px;
                background: #1e40af;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }
  
              .email-button:hover {
                background: #1e3a8a;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              }
  
              .email-footer {
                background: #f8fafc;
                text-align: center;
                padding: 24px;
                font-size: 14px;
                color: #6b7280;
                border-top: 1px solid #e2e8f0;
              }
  
              .email-footer a {
                color: #3b82f6;
                text-decoration: none;
                font-weight: 500;
              }
  
              .email-footer a:hover {
                text-decoration: underline;
              }
  
              @media only screen and (max-width: 600px) {
                .email-wrapper {
                  margin: 16px;
                  border-radius: 8px;
                }
  
                .email-header {
                  padding: 24px 16px;
                }
  
                .email-header h1 {
                  font-size: 24px;
                }
  
                .email-content {
                  padding: 24px 16px;
                  font-size: 15px;
                }
  
                .email-button {
                  padding: 10px 24px;
                  font-size: 15px;
                }
  
                .email-footer {
                  padding: 16px;
                  font-size: 13px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-header">
                <h1>${subject}</h1>
              </div>
              <div class="email-content">
                <p>${text}</p>
              </div>
              <div class="email-footer">
                &copy; ${new Date().getFullYear()} AI-MENTAL-HEALTH-CARE. All rights reserved.<br>
                <a href="https://internetoriginals.com">internetoriginals.com</a> | <a href="mailto:support@internetoriginals.com">Contact Support</a>
              </div>
            </div>
          </body>
          </html>
        `,
    });

    return info;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error sending email',
    );
  }
}
