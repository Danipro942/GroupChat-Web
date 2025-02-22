import {z} from 'zod'

export const RegisterFormSchema = z.object({
    email: z.string().min(1, 'This field is required')
    .email('Invalid email address')
    .min(3, 'The title must be at least 3 characters long').max(100, 'The title is too long'),
    username: z.string().min(3, 'The title must be at least 3 characters long').max(30, 'The title is too long'),
    password: z.string().min(1, 'This field is required'),
    confirmPassword: z.string().min(1, 'This field is required')
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type RegisterForm = z.infer<typeof RegisterFormSchema>