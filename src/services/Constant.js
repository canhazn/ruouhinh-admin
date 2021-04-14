const prod = {
    API_URL: 'https://api.ruouhinh.com/api'
};

const dev = {
    API_URL: 'http://localhost:8000/api'
    // API_URL: 'http://192.168.1.49:8000/api'    
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;