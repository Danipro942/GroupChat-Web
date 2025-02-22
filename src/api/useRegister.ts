import axios, {AxiosError} from 'axios'
import { ErrorResponse, UserToken } from '../types/user'
import {useMutation} from '@tanstack/react-query'
import { data,  } from 'react-router-dom'


type RegisterUser = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

const postUserRegister = async (dataUser: RegisterUser) => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`
    console.log(dataUser)
    const response = await axios.post<UserToken>(URL, dataUser)
    return response.data
}

export default function useRegister(){
    return useMutation<UserToken, AxiosError<ErrorResponse>, RegisterUser>({
        mutationFn: postUserRegister
    })
}