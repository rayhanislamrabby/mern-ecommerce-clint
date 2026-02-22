import axios from "axios";

const axiosPublic = axios.create({
   
    baseURL: `https://e-commerce-server-liart.vercel.app`, 
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;