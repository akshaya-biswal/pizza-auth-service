import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    errorMessage: "Email is required",
    notEmpty: true,
    trim: true,
  },
  firstName: {
    errorMessage: "First name is required!",
    notEmpty: true,
    trim: true,
  },
  lastName: {
    errorMessage: "Last name is required!",
    notEmpty: true,
    trim: true,
  },
  password: {
    trim: true,
    errorMessage: "Last name is required!",
    notEmpty: true,
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Password length should be at least 8 chars!",
    },
  },
});
