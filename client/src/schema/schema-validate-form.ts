import * as yup from "yup";
const registerSchema = yup
  .object({
    username: yup.string().max(20).required(),
    email: yup.string().email().required(),
    password: yup.string().max(20).min(6).required(),
  })
  .required();

  const loginSchema = yup
  .object({
    email: yup.string().max(20).email().required(),
    password: yup.string().max(20).min(6).required(),
  })
  .required();
  const addPostSchema = yup
  .object({
    title: yup.string().max(20).required(),
  })
  .required();
export {
    registerSchema,
    loginSchema,
    addPostSchema
}