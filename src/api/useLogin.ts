import axios, {AxiosError} from 'axios'
import { UserToken } from '../types/user'
import {useMutation} from '@tanstack/react-query'


type LoginUser = {
    username: string,
    password: string
}

const postUserLogin = async (dataUser: LoginUser) => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`
    console.log(dataUser)
    const response = await axios.put<UserToken>(URL, dataUser)
    return response.data
}

console.log(import.meta.env.BACKEND_URL)

export default function useLogin(){
    return useMutation<UserToken, AxiosError, LoginUser>({
        mutationFn: postUserLogin
    })
}