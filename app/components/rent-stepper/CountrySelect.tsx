'use client'

import useCountries from "@/app/hooks/useCountries";
import {FC} from "react";
import Select from "react-select";
import Image from "next/image";

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    region: string;
    value: string;
}

interface CountrySelectProps {
    value?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void;
}

const CountrySelect: FC<CountrySelectProps> = ({onChange, value}) => {
    const {getAll} = useCountries();
    return (
        <div>
            <Select
                isClearable
                placeholder="Anywhere"
                options={getAll()}
                value={value}
                onChange={(value) => onChange(value as CountrySelectValue)}
                formatOptionLabel={(option) => (
                    <div className="flex flex-row items-center gap-3">
                        <Image src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${option.value}.svg`}
                               alt={option.label} width={30} height={20}/>
                        <div>
                            {option.label}, <span className="text-neutral-500 ml-1">{option.region}</span>
                        </div>
                    </div>
                )}
                classNames={{
                    control: () => 'p-2 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg',
                }}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                        ...theme.colors,
                        primary: 'black',
                        primary25: '#ffe4e6',
                    }
                })}
            />
        </div>
    )
}

export default CountrySelect