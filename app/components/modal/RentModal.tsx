'use client'

import Modal from "@/app/components/modal/Modal";
import useRentModal from "@/app/hooks/useRentModal";
import {useMemo, useState} from "react";
import Heading from "@/app/components/Heading";
import {categories} from "@/app/components/category/Categories";
import CategoryInput from "@/app/components/category/CategoryInput";
import {FieldValues, useForm} from "react-hook-form";

enum STEPS {
    CATEGORY,
    LOCATION,
    INFO,
    IMAGES,
    DESCRIPTION,
    PRICE,
}

const RentModal = () => {
    const rentModal = useRentModal();

    const [step, setStep] = useState<STEPS>(STEPS.CATEGORY);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors},
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: "",
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

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const onBack = () => setStep((value) => value - 1)

    const onNext = () => setStep((value) => value + 1)

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return "Create"
        }

        return "Next"
    }, [step])

    const secondActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }

        return "Back"
    }, [step])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="Which of these best describes your home?" subtitle="Pick a category" center/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((category) => (
                    <CategoryInput
                        key={category.label}
                        onClick={(cate) => setCustomValue("category", cate)}
                        selected={categoryWatcher === category.label}
                        label={category.label}
                        icon={category.icon}/>
                ))}
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={rentModal.onClose}
            actionLabel={actionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            secondaryActionLabel={secondActionLabel}
            title="Rent your home"
            body={bodyContent}/>
    )
}

export default RentModal;