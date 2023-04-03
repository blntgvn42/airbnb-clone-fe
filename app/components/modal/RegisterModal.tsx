'use client'

import axios from "axios";
import {AiFillGithub} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import {useState, useCallback} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";

import useRegisterModal from "@/app/components/hooks/useRegisterModal";
import Modal from "@/app/components/modal/Modal";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/Input";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";

const RegisterModal = () => {
    const registerModal = useRegisterModal()
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

    const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
        setIsLoading(true)
        await axios
            .post('/api/register', data)
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
                         onClick={registerModal.onClose}>Login
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