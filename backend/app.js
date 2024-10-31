const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const lighthouse = require('@lighthouse-web3/sdk')
require('dotenv').config()

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
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
    voters: [{
        address: String,
        vote: String
    }],
    createdAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
})

const Submission = mongoose.model('Submission', submissionSchema)

// Define verified info schema
const verifiedInfoSchema = new mongoose.Schema({
    submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    },
    lighthouseHash: String,
    verifiedAt: { type: Date, default: Date.now }
})

const VerifiedInfo = mongoose.model('VerifiedInfo', verifiedInfoSchema)

// Configuration for cleanup interval
const CLEANUP_INTERVAL = 10000 
const SUBMISSION_EXPIRY = 1 * 60 * 1000 
const VERIFICATION_THRESHOLD = 80 

// Cleanup expired unverified submissions every minute
setInterval(async () => {
    const expiryTime = new Date(Date.now() - SUBMISSION_EXPIRY)
    const expiredSubmissions = await Submission.find({
        createdAt: { $lt: expiryTime },
        verified: false
    })

    for (const submission of expiredSubmissions) {
        const totalVotes = submission.votes.yes + submission.votes.no
        if (totalVotes > 0) {
            const yesPercentage = (submission.votes.yes / totalVotes) * 100
            
            if (yesPercentage >= VERIFICATION_THRESHOLD) {
                // Uploading to Lighthouse 
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

                    // Store verified info with lighthouse hash
                    const verifiedInfo = new VerifiedInfo({
                        submissionId: submission._id,
                        lighthouseHash: uploadResponse.data.Hash
                    })
                    await verifiedInfo.save()
                    
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
}, CLEANUP_INTERVAL)

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

        if (submission.voters.some(v => v.address === verifier)) {
            return res.status(400).json({ error: "Already voted" })
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

const downloadFile = async (cid) => {
  try {
    const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to download the file:", error);
    throw error;
  }
};

app.get("/verifiedInfo", async (req, res) => {
    try {
        const verifiedInfos = await VerifiedInfo.find()
        const combinedData = []

        for (const info of verifiedInfos) {
            try {
                // Download and parse JSON directly from Lighthouse gateway
                const submissionData = await downloadFile(info.lighthouseHash)
                
                combinedData.push({
                    ...submissionData,
                    verifiedAt: info.verifiedAt,
                    lighthouseHash: info.lighthouseHash
                })
            } catch (error) {
                console.error(`Error downloading hash ${info.lighthouseHash}:`, error)
                // Continue with next hash even if one fails
                continue
            }
        }

        res.json(combinedData)
    } catch (error) {
        console.error("Error fetching verified info:", error)
        res.status(500).json({error: "Failed to fetch verified information"})
    }
})

app.listen(3001)