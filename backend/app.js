const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const lighthouse = require('@lighthouse-web3/sdk')
require('dotenv').config()

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/disaster-relief', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Define submission schema
const submissionSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    category: String,
    sender: String,
    votes: {
        yes: { type: Number, default: 0 },
        no: { type: Number, default: 0 }
    },
    voters: [String],
    createdAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
})

const Submission = mongoose.model('Submission', submissionSchema)

// Cleanup expired unverified submissions every minute
setInterval(async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    const expiredSubmissions = await Submission.find({
        createdAt: { $lt: thirtyMinutesAgo },
        verified: false
    })

    for (const submission of expiredSubmissions) {
        const totalVotes = submission.votes.yes + submission.votes.no
        if (totalVotes > 0) {
            const yesPercentage = (submission.votes.yes / totalVotes) * 100
            
            if (yesPercentage >= 80) {
                // Upload to Lighthouse if verified
                const jsonData = JSON.stringify({
                    title: submission.title,
                    description: submission.description,
                    location: submission.location,
                    category: submission.category,
                    sender: submission.sender
                })

                try {
                    const uploadResponse = await lighthouse.uploadText(
                        jsonData,
                        process.env.LIGHTHOUSE_API_KEY
                    )
                    
                    submission.verified = true
                    await submission.save()
                    
                    // TODO: Future implementation
                    // - Reward uploader for successful verification (>80% yes votes)
                    // - Reward verifiers who voted with majority
                    
                } catch (error) {
                    console.error("Error uploading to Lighthouse:", error)
                }
            } else {
                await submission.deleteOne()
            }
        } else {
            await submission.deleteOne()
        }
    }
}, 60000)

app.post("/submission", async (req, res) => {
    try {
        const {title, description, location, category, sender} = req.body

        const submission = new Submission({
            title,
            description,
            location,
            category,
            sender
        })

        await submission.save()
        res.json(submission)

    } catch (error) {
        console.error("Error creating submission:", error)
        res.status(500).json({error: "Failed to create submission"})
    }
})

app.post("/verify", async (req, res) => {
    try {
        const { submissionId, vote, verifier } = req.body

        const submission = await Submission.findById(submissionId)
        if (!submission) {
            return res.status(404).json({ error: "Submission not found" })
        }

        if (submission.voters.includes(verifier)) {
            return res.status(400).json({ error: "Already voted" })
        }

        submission.voters.push(verifier)
        if (vote === 'yes') {
            submission.votes.yes++
        } else {
            submission.votes.no++
        }

        await submission.save()
        res.json(submission)

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

app.listen(3001)