import { mongodbURI } from "@/config/constant";
import mongoose from "mongoose";

type ConnectionObject ={
    isConnected?: number
}


const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('DB is already connected to database');
        return;
    }

    try {
        const db = await mongoose.connect(mongodbURI || "",{});

        connection.isConnected = db.connections[0].readyState;

        console.log('DB connected to Successfully');

    } catch (error) {
        console.log("Connection failed to database",error);
        process.exit(1);
    }
}
export default dbConnect;