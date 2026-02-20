import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth"; // Apnar auth hook
import useAxiosSecure from "./useAxiosSecures"; 

const useUserRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: userRole, isPending: isRoleLoading, refetch } = useQuery({
        queryKey: [user?.email, 'userRole'],
        enabled: !loading && !!user?.email, // User login thakle ebong loading shesh hole call hobe
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/admin/${user?.email}`);
            return res.data?.role; // Backend theke shudhu role-ta return korbe (e.g., "admin" or "user")
        }
    });

    return {userRole, isRoleLoading, refetch};
};

export default useUserRole;