import {
  body as validateBody,
  header as validateHeader,
  oneOf,
  validationResult
} from "express-validator";

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next({
      status: 400,
      message: errors.array()
    });
  next();
};

export const validateAuthRoute = [
  [
    validateBody()
      .exists()
      .withMessage("Body must be valid JSON"),
    validateBody("email")
      .exists()
      .withMessage("Body must contain `email`")
      .bail()
      .isEmail()
      .withMessage("Body must have valid email"),
    validateBody("password")
      .exists()
      .withMessage("Body must contain `password`"),
    validate
  ]
];

export const validateUpdateUser = [
  [
    validateBody()
      .exists()
      .withMessage("Body must be valid JSON"),
    validate
  ]
];

export const validateChangePassword = [
  validateBody()
    .exists()
    .withMessage("Body must be valid JSON"),
  validateBody("newPassword")
    .exists()
    .withMessage("Body must contain `newPassword`"),

  oneOf([
    [
      validateHeader("Authorization")
        .exists()
        .withMessage("Bearer authorization required"),
      validateBody("email")
        .exists()
        .withMessage("Body must contain `email`")
        .bail()
        .isEmail()
        .withMessage("Body must have valid email"),
      validateBody("oldPassword")
        .exists()
        .withMessage("Body must contain `oldPassword`")
    ],
    validateBody("resetToken")
      .exists()
      .withMessage("Body must contain `resetToken`")
  ]),
  validate
];
