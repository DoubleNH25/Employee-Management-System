export const setAuthToken = (token, role) => {
    if (token) {
        localStorage.setItem(`${role}Token`, token);
    }
};

export const getAuthToken = (role) => {
    return localStorage.getItem(`${role}Token`);
};

export const removeAuthToken = (role) => {
    localStorage.removeItem(`${role}Token`);
};

export const clearAllTokens = () => {
    localStorage.removeItem('hrToken');
    localStorage.removeItem('employeeToken');
};
