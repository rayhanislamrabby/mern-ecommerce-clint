import axios from "axios";

const axiosPublic = axios.create({
   
    baseURL: `https://e-commerce-server-zeta-nine.vercel.app`, 
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;