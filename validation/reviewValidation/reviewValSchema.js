let joi = require("joi");

let reviewVal = {
  registerUser: joi
    .object({
      subject: joi
        .string()
        .min(3)
        .max(30)
        .message({
          "String.min": "{#label} should contains at least {#limit} charecters",
          "String.max": "{#label} should contains at least {#limit} charecters",
        })
        .required(),

      review: joi
        .string()
        .min(3)
        .max(30)
        .message({
          "String.min": "{#label} should contains at least {#limit} charecters",
          "String.max": "{#label} should contains at least {#limit} charecters",
        })
        .required(),

      rating: joi
        .string()
        .min(3)
        .max(30)
        .message({
          "String.min": "{#label} should contains at least {#limit} charecters",
          "String.max": "{#label} should contains at least {#limit} charecters",
        })
        .required(),
    })
    .unknown(true),
};

module.exports = reviewVal;
