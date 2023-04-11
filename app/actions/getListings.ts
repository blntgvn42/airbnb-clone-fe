import prisma from "@/app/libs/prismadb";

export default async function getListings() {
    try {
        return await prisma.listing.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true
            }
        })
    } catch (error: any) {
        throw  new Error(error)
    }
}