import { useQuery } from "@tanstack/react-query";
import { endpoints } from '../api/endpoints';
import { useNavigate } from '@tanstack/react-router';


export function useSets() {
    const navigate = useNavigate();

    return useQuery({
        queryKey: ['setHistory'],
        queryFn: async () => {
            const response = await fetch(endpoints.setHistory, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            console.log(data);
            return data;
        },

        retry: 3
    });
}



