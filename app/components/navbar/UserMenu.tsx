'use client'

import {AiOutlineMenu} from "react-icons/ai";
import Avatar from "@/app/components/elements/Avatar";
import {FC, useCallback, useState} from "react";
import MenuItem from "@/app/components/navbar/MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import {User} from "@prisma/client";
import {signOut} from "next-auth/react";
import useRentModal from "@/app/hooks/useRentModal";

interface UserMenuProps {
    currentUser?: User | null;
}


const UserMenu: FC<UserMenuProps> = ({currentUser}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const rentModal = useRentModal()

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])

    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen()
        }

        rentModal.onOpen()
    }, [currentUser, loginModal, rentModal])

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={onRent}
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                    Airbnb your home
                </div>
                <div
                    onClick={toggleOpen}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                    <AiOutlineMenu size={18}/>
                    <div className="hidden md:block">
                        <Avatar/>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                        <>
                            {
                                currentUser ?
                                    <>
                                        <MenuItem label="My Trips" onClick={() => console.log('reviews')}/>
                                        <MenuItem label="My Favourites" onClick={() => console.log('reviews')}/>
                                        <MenuItem label="My Reservations" onClick={() => console.log('reviews')}/>
                                        <MenuItem label="My Properties" onClick={() => console.log('reviews')}/>
                                        <MenuItem label="Airbnb My Home" onClick={rentModal.onOpen}/>
                                        <MenuItem label="Logout" onClick={() => signOut()}/>
                                    </>
                                    :
                                    <>
                                        <MenuItem onClick={loginModal.onOpen} label="Login"/>
                                        <MenuItem onClick={registerModal.onOpen} label="Sign Up"/>
                                    </>
                            }

                        </>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu