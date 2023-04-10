import {NextResponse} from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/gerCurrentUser";

export async function POST(req: Request) {
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.error()
    }

    const body = await req.json();
    const {title, description, imageSrc, category, roomCount, bathroomCount, guestCount, location, price} = body

    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            location: location.value,
            price: parseInt(price),
            userId: user.id
        }
    })

    return NextResponse.json(listing)
}