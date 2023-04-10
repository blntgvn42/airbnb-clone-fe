'use client';

import axios from 'axios';
import {toast} from 'react-hot-toast';
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import dynamic from 'next/dynamic'
import {useRouter} from 'next/navigation';
import {useMemo, useState} from "react";

import useRentModal from '@/app/hooks/useRentModal';
import Heading from "@/app/components/elements/Heading";
import {categories} from "@/app/components/category/Categories";
import CategoryInput from "@/app/components/rent-stepper/CategoryInput";
import CountrySelect from "@/app/components/rent-stepper/CountrySelect";
import Counter from "@/app/components/rent-stepper/Counter";
import ImageUpload from "@/app/components/rent-stepper/ImageUpload";
import Input from "@/app/components/elements/Input";
import Modal from "@/app/components/modal/Modal";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(STEPS.CATEGORY);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors},
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: '',
        }
    })

    const categoryWatcher = watch("category");
    const locationWatcher = watch("location");
    const guestCountWatcher = watch("guestCount");
    const roomCountWatcher = watch("roomCount");
    const bathroomCountWatcher = watch("bathroomCount");
    const imageSrcWatcher = watch("imageSrc");

    const Map = useMemo(() => dynamic(() => import("@/app/components/rent-stepper/Map"), {ssr: false}), [locationWatcher]);

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    }

    const onBack = () => setStep((value) => value - 1)

    const onNext = () => setStep((value) => value + 1)

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }
        setIsLoading(true)
        axios
            .post("/api/listings", data)
            .then(() => {
                toast.success("Listing created successfully!")
                router.refresh()
                reset()
                setStep(STEPS.CATEGORY)
                setIsLoading(false)
                rentModal.onClose()
            })
            .catch(() => {
                toast.error("Something went wrong!")
                setIsLoading(false)
            })
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return "Create"
        }

        return "Next"
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }

        return "Back"
    }, [step])

    let bodyContent: null | JSX.Element

    if (step === STEPS.CATEGORY) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Which of these best describes your home?" subtitle="Pick a category" center/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                    {categories.map((category) => (
                        <CategoryInput
                            key={category.label}
                            onClick={(cate) => setCustomValue("category", cate)}
                            selected={categoryWatcher === category.label}
                            label={category.label}
                            icon={category.icon}
                        />
                    ))}
                </div>
            </div>
        );
    } else if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Where is your home located?"
                    subtitle="Pin your home on map"
                    center
                />
                <CountrySelect
                    value={locationWatcher}
                    onChange={(value) => setCustomValue("location", value)}
                />
                <Map center={locationWatcher?.latlng}/>
            </div>
        )
    } else if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some basics about your home"
                    subtitle="What amenities does your home have?"
                    center
                />
                <Counter
                    title="Guests"
                    subtitle="How many guest do you allow?"
                    value={guestCountWatcher}
                    onChange={(value) => setCustomValue("guestCount", value)}
                />
                <Counter
                    title="Rooms"
                    subtitle="How many rooms are there?"
                    value={roomCountWatcher}
                    onChange={(value) => setCustomValue("roomCount", value)}
                />
                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms are there?"
                    value={bathroomCountWatcher}
                    onChange={(value) => setCustomValue("bathroomCount", value)}
                />
            </div>
        )
    } else if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Add a photo of your place"
                    subtitle="Show guests what your place looks like!"
                    center
                />
                <ImageUpload
                    value={imageSrcWatcher}
                    onChange={(value) => setCustomValue("imageSrc", value)}
                />
            </div>
        )
    } else if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How would you describe your place?"
                    subtitle="Short and sweet works best!"
                />
                <Input
                    id="title"
                    label="Title"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <Input
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                    isTextArea
                />
            </div>
        )
    } else if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How much does your place cost?"
                    subtitle="How much will you charge for a night!"
                    center
                />
                <Input
                    id="price"
                    label="Price"
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    formatPrice
                    required
                />
            </div>
        )
    } else {
        bodyContent = (
            <>
            </>
        )
    }

    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            disabled={isLoading}
            title="Rent your home!"
            body={bodyContent}
        />
    );
}

export default RentModal;