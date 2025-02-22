import {z} from 'zod'

export const sendMessageSchema = z.object({
       message: z.string().min(1, 'This field is required')
})

export type sendMessageForm = z.infer<typeof sendMessageSchema>