const SESSION_KEY = 'session'

export function getSession() {
    return localStorage.getItem(SESSION_KEY)
}

export function setSession(token: string){
    localStorage.setItem(SESSION_KEY, token)
}

export function deleteSession() {
    localStorage.setItem(SESSION_KEY, '')
}