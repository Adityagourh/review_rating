const joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);

const schema = {
  registerUser: joi
    .object({
      userName: joi
        .string()
        .min(3)
        .max(30)
        .message({
          "String.min": "{#label} should contains at least {#limit} charecters",
          "String.max": "{#label} should contains at least {#limit} charecters",
        })
        .required(),

      userEmail: joi
        .string()
        .email()
        .message("invalid email address")
        .required(),

      userPassword: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .messages({
          "password.minOfUppercase":
            "{#label} should contain at least {#min} uppercase character",
          "password.minOfSpecialCharacters":
            "{#label} should contain at least {#min} special character",
          "password.minOfLowercase":
            "{#label} should contain at least {#min} lowercase character",
          "password.minOfNumeric":
            "{#label} should contain at least {#min} numeric character",
          "password.noWhiteSpaces": "{#label} should not contain white spaces",
          "password.onlyLatinCharacters":
            "{#label} should contain only latin characters",
        }),
      userPhone: joi
        .number()
        .integer()
        .min(100000000)
        .max(9999999999)
        .message("invalid mobile number")
        .required(),

      userCity: joi.string().required(),

      userState: joi.string().required(),
    })
    .unknown(true),

  //--------login validation---------

   loginUserValidation: joi
    .object({
      userEmail: joi
        .string()
        .email()
        .message("invalid email address")
        .required(),
      userPassword: joi.string().required(),
    })
    .unknown(true),

  //--------Reset Password
  resetPassword: joi.object({
    newPassword: joiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .messages({
        "password.minOfUppercase":
          "{#label} should contain at least {#min} uppercase character",
        "password.minOfSpecialCharacters":
          "{#label} should contain at least {#min} special character",
        "password.minOfLowercase":
          "{#label} should contain at least {#min} lowercase character",
        "password.minOfNumeric":
          "{#label} should contain at least {#min} numeric character",
        "password.noWhiteSpaces": "{#label} should not contain white spaces",
        "password.onlyLatinCharacters":
          "{#label} should contain only latin characters",
      }),
      confirmPassword:joi
      .any().equal(joi.ref('newPassword')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' }),
})
};

module.exports = schema;
