import {z} from 'zod'

export const LoginFormSchema = z.object({
    username: z.string().min(3, "The field need to have 3 character at least").max(20, "The username is too long, Try a different one"),
    password: z.string().min(3, "The field need to have 3 character at least").max(100, "This password is too long, Pleae try again")
})

export type LoginForm = z.infer<typeof LoginFormSchema>