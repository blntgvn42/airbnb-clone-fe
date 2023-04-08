'use client'

import {CldUploadWidget} from "next-cloudinary";
import Image from "next/image";
import {TbPhotoPlus} from "react-icons/tb";
import {FC, useCallback} from "react";

declare global {
    var cloudinary: any;
}

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}

const ImageUpload: FC<ImageUploadProps> = ({onChange, value}) => {
    const handleUpload = useCallback((result: any) => {
        onChange(result.info.secure_url);
    }, [onChange]);
    return (
        <CldUploadWidget onUpload={handleUpload} uploadPreset="b9iuj777" options={{
            maxFiles: 1,
        }}>
            {({open}) => {
                return (
                    <div onClick={() => open?.()}
                         className="relative cursor-pointer hover:opacity-70 transition border-2 border-dashed p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-400">
                        <TbPhotoPlus size={50}/>
                        <div className="font-semibold text-lg">
                            Click to upload image
                        </div>
                        {value && (
                            <div className="absolute inset-0 w-full h-full">
                                <Image alt="upload" src={value} fill style={{ objectFit: "cover"}}/>
                            </div>
                        )}
                    </div>
                )
            }}
        </CldUploadWidget>
    )
}

export default ImageUpload