import express from 'express';
import jwt from 'jsonwebtoken'
import { signinSchema, signupSchema } from './Zodmodels';
import { prisma } from './db';
import { authMiddleware } from './authMIddleware';

// added a comment

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const { success, data, error } = signupSchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: 'Invalid Inputs'
        })
        return
    }
    const user = await prisma.users.create({
        data: {
            username: data.username,
            email: data.email,
            password: data.password,
        }
    })

    res.status(200).json({
        message: 'User created successfully',
        userId: user.id
    })
});

app.post("/signin", async (req, res) => {
    const { success, data, error } = signinSchema.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: 'Invalid Inputs'
        })
        return
    }
    const user = await prisma.users.findUnique({
        where: {
            email: data.email,
        }
    });

    if (!user) {
        res.status(400).json({
            message: "user not found"
        })
        return
    }

    const token = jwt.sign(user.id, `${process.env.JWT_SECRET}`)

    res.status(200).json({
        message: 'token generated',
        token: token
    })
});

app.get("/me", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const user = await prisma.users.findFirst({
        where: {
            id: userId
        }
    })
    res.status(200).json({
        user
    })
});