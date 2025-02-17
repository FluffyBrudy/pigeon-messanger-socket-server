import Joi from "joi";

export const idValidation = (idFieldName: string) => {
  return Joi.object({
    [idFieldName]: Joi.string().uuid().required(),
  });
};

export const messageValidation = Joi.object({
  creatorId: Joi.string().uuid().required(),
  message: Joi.string().min(1).required(),
  recipientId: Joi.array().items(Joi.string().uuid()).min(1).required(),
});
