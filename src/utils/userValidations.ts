import * as yup from 'yup';

export const userSchema = yup.object().shape({
    username: yup.string().min(4).max(10).required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).max(15).required(),
})