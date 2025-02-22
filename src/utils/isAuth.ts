import apiClient from "../api/apiClient";
import { getSession } from "./SessionStorage";

export const isAuth =async () => {
    if(!getSession()){
        return false
    }

    const URL = `/auth/verify/${getSession()}`;

    try {
         await apiClient.get<{verifyToken: boolean}>(URL);
        return true
    } catch (error) {
        return false
    }

}