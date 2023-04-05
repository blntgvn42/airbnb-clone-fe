'use client'

import {AiFillGithub} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import {useCallback, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/Input";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "@/app/components/modal/Modal";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import useRegisterModal from "@/app/hooks/useRegisterModal";

const LoginModal = () => {
    const loginModal = useLoginModal()
    const registerModal = useRegisterModal()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const toggleModal = useCallback(() => {
        loginModal.onClose()
        registerModal.onOpen()
    }, [registerModal, loginModal])

    const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
        setIsLoading(true)
        await signIn('credentials', {
            ...data,
            redirect: false,
        })
            .then((res) => {
                setIsLoading(false)
                if (res?.ok) {
                    toast.success('Logged in')
                    router.refresh()
                    loginModal.onClose()
                }

                if (res?.error) {
                    toast.error('Invalid credentials')
                }
            })
    }, [loginModal, router])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back to AirBnb" subtitle="Sign in" center/>
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
                    <div className="text-neutral-400">Dont have an account?</div>
                    <div className="text-neutral-800 cursor-pointer hover:underline"
                         onClick={toggleModal}>Register
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal