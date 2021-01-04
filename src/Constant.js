const prod = {
    API_URL: 'https://cuu-ho-oto.appspot.com/api'
};

const dev = {
    API_URL: 'http://localhost:8000/api'
    // API_URL: 'http://192.168.35.1:3001/api'    
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;