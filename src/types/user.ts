export type UserToken = {
    token: string
}

export type UserType = {
    username: string;
    email: string;
    _id: string;
    profilePicture: string
  };

  export interface ErrorResponse {
    message: string;
  }

  export type SearchUserType = {
    username: string,
    profilePicture: string,
  }

export type ChatType = {
  _id: string;
  users: UserType[];
  createdAt: string;
  updatedAt: string;
  lastMessage: string
  __v?: number; // Opcional si quieres incluirlo
};