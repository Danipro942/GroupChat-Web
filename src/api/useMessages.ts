import {useQuery} from '@tanstack/react-query'
import apiClient from './apiClient';
import { Messages } from '../types/message';

const fetchMessagesUser = async (username: string) => {
    const URL = `/user/messages/${username}`;
    const response = await apiClient.get<{ messages: Messages[] }>(URL);

    return response.data
}

export default function MessagesUser(username: string){
    return useQuery({
        queryKey: ["messages", username],
        queryFn: () => fetchMessagesUser(username),
        enabled: !!username
    })
}