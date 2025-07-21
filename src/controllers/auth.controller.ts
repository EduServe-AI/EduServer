import { Request , Response } from "express";
import { findUserByEmail , createStudent } from "../services/user.service";
import { generateToken } from "../utils/jwt";
import  Responder from "../utils/responder"


export const registerStudent = async (req : Request , res : Response) => {
    try {
        
        const { username , email , password } = req.body;

        // checking for student existence
        const existingStudent = await findUserByEmail(email);
        if (existingStudent) {
          return res.status(400).json({ message: "Email already exists" });
        } 
        

        const newStudent = await createStudent(username , email , password);

        const token = generateToken(newStudent.id , newStudent.role) 

        return Responder(res , {
            message : "Student registered successfully",
            data : {
                user : newStudent,
                token
            },
            httpCode : 200
        })

    } catch (error : any) {
        console.error("Signup error:" , error)
        Responder(res , {
            error : error,
            message : "Internal Server Error",
            httpCode : 500
        })
    }
}
