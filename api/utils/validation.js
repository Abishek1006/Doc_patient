import Joi from 'joi';

export const appointmentSchema = Joi.object({
  username: Joi.string().required(),
  phone: Joi.string().pattern(/^\+?[\d\s-]+$/),
  email: Joi.string().email().required(),
  gender: Joi.string().valid('Male', 'Female', 'Other'),
  age: Joi.number().min(0).max(150),
  serviceTitle: Joi.string().required(),
  appointmantDate: Joi.date().greater('now').required()
});

export const validateAppointment = (req, res, next) => {
  const { error } = appointmentSchema.validate(req.body);
  if (error) {
    throw new AppError(400, error.details[0].message);
  }
  next();
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    // At least 8 characters, 1 letter and 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};




