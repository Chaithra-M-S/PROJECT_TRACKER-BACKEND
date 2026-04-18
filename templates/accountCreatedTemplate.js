const accountCreatedTemplate = (name, email, password) => {
  return `
Hello ${name},

You can now sign in to your account using the credentials below:

Email: ${email}
Password: ${password}

Please log in and change your password after your first login.

Login here: http://projecttracker.com/login

If you face any issues, contact the administrator.

Regards,
Project Tracking System
  `;
};

export default accountCreatedTemplate;