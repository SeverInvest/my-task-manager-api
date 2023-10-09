const { celebrate, Joi } = require('celebrate');

// const urlCheckPattern = /https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?/;
const nameCheckPattern = /^(?!\s)[-A-Za-zА-Яа-яЁё\s]+$/;
// const urlLinkYoutube = /^https:\/\/youtu.be\/[\w-]{11}$/;

const authValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .pattern(nameCheckPattern)
      .min(2)
      .max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .pattern(nameCheckPattern)
      .min(2)
      .max(30),
    email: Joi.string().required().email(),
  }),
});

// const videoLinkValidate = celebrate({
//   body: Joi.object().keys({
//     videoLink: Joi.string()
//       .pattern(urlLinkYoutube),
//   }),
// });

module.exports = {
  authValidate,
  registerValidate,
  userValidate,
  // videoLinkValidate,
};
