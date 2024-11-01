const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const lighthouse = require('@lighthouse-web3/sdk')
require('dotenv').config()
const { Submission, VerifiedInfo } = require("./modals");
const {
  CLEANUP_INTERVAL,
  SUBMISSION_EXPIRY,
} = require('./config')

const {
  processExpiredSubmission,
  getCombinedVerifiedInfo,
} = require("./utils");


// Configure CORS with specific options
app.use(cors({
    origin: '*', // Allow all origins - you may want to restrict this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials
}))
app.use(express.json())

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

connectDB()


// Cleanup expired unverified submissions every minute
setInterval(async () => {
    const expiryTime = new Date(Date.now() - SUBMISSION_EXPIRY)
    const expiredSubmissions = await Submission.find({
        createdAt: { $lt: expiryTime },
        verified: false
    })

    for (const submission of expiredSubmissions) {
        await processExpiredSubmission(submission)
    }
}, CLEANUP_INTERVAL)

const createSubmission = async (submissionData) => {
    const submission = new Submission(submissionData)
    await submission.save()
    return submission
}

app.post("/submission", async (req, res) => {
    try {
        const {title, description, location, category, sender} = req.body
        const submission = await createSubmission({
            title,
            description,
            location,
            category,
            sender
        })
        res.json(submission)
    } catch (error) {
        console.error("Error creating submission:", error)
        res.status(500).json({error: "Failed to create submission"})
    }
})

const processVote = async (submission, vote, verifier) => {
    if (submission.voters.some(v => v.address === verifier)) {
        throw new Error("Already voted")
    }

    submission.voters.push({
        address: verifier,
        vote: vote
    })
    
    if (vote === 'yes') {
        submission.votes.yes++
    } else {
        submission.votes.no++
    }

    await submission.save()
    return submission
}

app.post("/verify", async (req, res) => {
    try {
        const { submissionId, vote, verifier } = req.body

        const submission = await Submission.findById(submissionId)
        if (!submission) {
            return res.status(404).json({ error: "Submission not found" })
        }

        // Check if user has already voted
        if (submission.voters.some(v => v.address === verifier)) {
            return res.json({
                status: "done",
                message: "You have already voted on this submission"
            })
        }

        const updatedSubmission = await processVote(submission, vote, verifier)
        res.json(updatedSubmission)
    } catch (error) {
        console.error("Error verifying submission:", error)
        res.status(500).json({error: "Failed to verify submission"})
    }
})

app.get("/submissions", async (req, res) => {
    try {
        const submissions = await Submission.find({ verified: false })
        res.json(submissions)
    } catch (error) {
        console.error("Error fetching submissions:", error)
        res.status(500).json({error: "Failed to fetch submissions"})
    }
})





app.get("/verifiedInfo", async (req, res) => {
    try {
        const combinedData = await getCombinedVerifiedInfo()
        res.json(combinedData)
    } catch (error) {
        console.error("Error fetching verified info:", error)
        res.status(500).json({error: "Failed to fetch verified information"})
    }
})

app.listen(3001)