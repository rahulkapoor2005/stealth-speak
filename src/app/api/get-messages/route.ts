import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if(!session || !user){
        return Response.json(
            {
                success: false,
                message: "User not authenticated !!"
            },
            {
                status: 401
            }
        )
    }
    const userID = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userID}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: "$_id", messages: {$push: "$messages"}}}
        ])

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found !!"
                }, 
                {
                    status: 404
                }
            )
        }
        if(user.length === 0){
            return Response.json(
                {
                    success: false,
                    message: "No messages found !!"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Error fetching messages", error)
        return Response.json(
            {
                success: false,
                message: "Failed to fetch messages"
            },
            {
                status: 500
            }
        )
    }
}