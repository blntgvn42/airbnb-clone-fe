'use client'

import Image from "next/image";
import {useRouter} from "next/navigation";

const Logo = () => {
    const router = useRouter();
    return (
        <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Image src="/images/logo.png" onClick={() => router.push("/")} width={100} height={100}  alt="Logo" priority
                   className="hidden md:block cursor-pointer"/>
        </div>
    );
};

export default Logo;