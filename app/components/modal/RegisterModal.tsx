'use client'

import axios from "axios";
import {AiFillGithub} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import {useCallback, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";

import Modal from "@/app/components/modal/Modal";
import Heading from "@/app/components/elements/Heading";
import Input from "@/app/components/elements/Input";
import toast from "react-hot-toast";
import Button from "@/app/components/elements/Button";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

const RegisterModal = () => {
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const [isLoading, setIsLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    const toggleModal = useCallback(() => {
        registerModal.onClose()
        loginModal.onOpen()
    }, [registerModal, loginModal])

    const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
        setIsLoading(true)
        await axios
            .post('/api/auth/register', data)
            .then(() => registerModal.onClose())
            .catch(() => toast.error("Something went wrong!"))
            .finally(() => setIsLoading(false))
    }, [registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome to AirBnb" subtitle="Create an account" center/>
            <Input
                required
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
            />
            <Input
                required
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
            />
            <Input
                required
                id="password"
                label="Password"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
            />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-center gap-4">
                <div className="w-full h-[1px] bg-neutral-200"/>
                <div className="text-neutral-400">Or</div>
                <div className="w-full h-[1px] bg-neutral-200"/>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
                <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => {
                }}/>
                <Button outline label="Continue with Github" icon={AiFillGithub} onClick={() => {
                }}/>
                <div className="flex flex-row items-center gap-2">
                    <div className="text-neutral-400">Already have an account?</div>
                    <div className="text-neutral-800 cursor-pointer hover:underline"
                         onClick={toggleModal}>Login
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal