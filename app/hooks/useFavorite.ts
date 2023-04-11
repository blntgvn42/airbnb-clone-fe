import {SafeUser} from "@/app/types";
import {useRouter} from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";
import React, {useCallback, useMemo} from "react";
import axios from "axios";
import {toast} from "react-hot-toast";

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({listingId,currentUser}:IUseFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const isFavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || []
        return list.includes(listingId)
    }, [currentUser, listingId])

    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (!currentUser) {
            return loginModal.onOpen()
        }

        try {
            let req;
            if (isFavorite) {
                req = () => axios.delete(`/api/favorites/${listingId}`)
            } else {
                req = () => axios.post(`/api/favorites/${listingId}`)
            }
            await req()
            router.refresh()
            toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
        } catch (error: any) {
            toast.error("Something went wrong")
        }
    }, [currentUser, isFavorite, listingId, loginModal, router])

    return {isFavorite, toggleFavorite}
}

export default useFavorite