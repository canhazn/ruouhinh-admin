const prod = {
    API_URL: 'https://www.ruouhinh.com/api'
};

const dev = {
    // API_URL: 'http://localhost:8000/api'
    API_URL: 'http://192.168.1.7:8000/api'    
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;