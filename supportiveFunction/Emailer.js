const nodemailer = require("nodemailer");

const sendEmailToUserWithTheirPassword = async (email, subject, payload) => {
  try {
    // Configure nodemailer with your email service provider settings
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "satyampandit021@gmail.com", // replace with your email
        pass: "mnlm kfcp wzwb dthw", // replace with your email password
      },
    });

    // Styling for the email content
    const styles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 23px 12px 15px rgba(0, 0, 0, 0.4);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .title {
          font-size: 24px;
          text-align: center;
          font-weight: bold;
          color: #333333;
        }
        .content {
          color: #666666;
          line-height: 1.6;
        }
      </style>
    `;
    // Email content with payload details
    const emailContent = `
      <div class="container">
        <div class="header">
        <p>Hello,</p>
          <p class="title">Password Reset For Apex App</p>
        </div>
        <div class="content"> 
          <p>Your Password Is ${payload}</p>
        </div>
      </div>
    `;
    // Send verification email
    const mailOptions = {
      from: "satyampandit021@gmail.com", // replace with your email
      to: email,
      subject: subject,
      html: `
        <html>
          <head>
            ${styles}
          </head>
          <body>
            ${emailContent}
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);

    return false;
  }
};

module.exports = {
  sendEmailToUserWithTheirPassword,
};
