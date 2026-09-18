const joi = require("joi");
const schema = {
  registerCompany: joi.object({
    companyName: joi
      .string()
      .min(3)
      .max(30)
      .message({
        "String.min": "{#label} should contains at least {#limit} charecters",
        "String.max": "{#label} should contains at least {#limit} charecters",
      })
      .required(),
    companyLocation: joi
      .string()
      .min(3)
      .max(30)
      .message({
        "String.min": "{#label} should contains at least {#limit} charecters",
        "String.max": "{#label} should contains at least {#limit} charecters",
      })
      .required(),
    companyCity: joi
      .string()
      .min(3)
      .max(30)
      .message({
        "String.min": "{#label} should contains at least {#limit} charecters",
        "String.max": "{#label} should contains at least {#limit} charecters",
      })
      .required(),
  }).unknown(true)
};
module.exports = schema;
