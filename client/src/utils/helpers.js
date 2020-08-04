export const email_validate_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const checkToken = () => {
    const token = localStorage.getItem('chatUserToken');
    if (!token) return window.location.reload(false);
    return token;
}

export const removeToken = () => {
    const token = localStorage.getItem('chatUserToken');
    if (token) localStorage.removeItem('chatUserToken');
    return window.location.reload(false);
}