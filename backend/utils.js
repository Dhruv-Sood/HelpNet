const lighthouse = require("@lighthouse-web3/sdk");
const mongoose = require("mongoose");
const { VERIFICATION_THRESHOLD } = require("./config");
const { Submission, VerifiedInfo } = require("./modals");
const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0x3eE4848bcE72b092a2e025605635Cf68b69f0492";
const CONTRACT_ABI = [
  "function distributeTokens(address recipient, uint256 amount)"
];

// Setup provider and contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tokenDistributor = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Function to upload data to Lighthouse
const uploadToLighthouse = async (submission) => {
  const jsonData = JSON.stringify({
    title: submission.title,
    description: submission.description,
    location: submission.location,
    category: submission.category,
    sender: submission.sender,
  });

  const uploadResponse = await lighthouse.uploadText(
    jsonData,
    process.env.LIGHTHOUSE_API_KEY
  );
  return uploadResponse;
};

// Function to handle verified submission
const handleVerifiedSubmission = async (submission, uploadResponse) => {
  submission.verified = true;
  await submission.save();

  const verifiedInfo = new VerifiedInfo({
    submissionId: submission._id,
    lighthouseHash: uploadResponse.data.Hash,
  });
  await verifiedInfo.save();

  // Reward uploader for successful verification (only if verified with 80%+ yes votes)
  await rewardUploader(submission.sender);

  // Reward verifiers who voted with majority
  await rewardMajorityVoters(submission);
};

// Function to reward the submission uploader
const rewardUploader = async (uploaderAddress) => {
  try {
    // Reward amount for uploaders (100 tokens)
    const uploaderReward = ethers.parseEther("100");
    
    const tx = await tokenDistributor.distributeTokens(uploaderAddress, uploaderReward);
    await tx.wait();
    
    console.log(`Rewarded uploader ${uploaderAddress} with ${uploaderReward} tokens`);
  } catch (error) {
    console.error("Error rewarding uploader:", error);
  }
};

// Function to reward verifiers who voted with majority
const rewardMajorityVoters = async (submission) => {
  try {
    const totalVotes = submission.votes.yes + submission.votes.no;
    const majorityVote = submission.votes.yes > submission.votes.no ? "yes" : "no";
    
    // Filter voters who voted with majority (regardless of verification status)
    const majorityVoters = submission.voters.filter(voter => voter.vote === majorityVote);
    
    // Reward amount for each voter (10 tokens)
    const voterReward = ethers.parseEther("10");
    
    // Reward each majority voter
    for (const voter of majorityVoters) {
      try {
        const tx = await tokenDistributor.distributeTokens(voter.address, voterReward);
        await tx.wait();
        console.log(`Rewarded voter ${voter.address} with ${voterReward} tokens for voting with majority (${majorityVote})`);
      } catch (error) {
        console.error(`Error rewarding voter ${voter.address}:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error("Error rewarding majority voters:", error);
  }
};

// Function to process expired submissions
const processExpiredSubmission = async (submission) => {
  const totalVotes = submission.votes.yes + submission.votes.no;
  console.log("Processing expired submission:", {
    totalVotes,
    yesVotes: submission.votes.yes,
    noVotes: submission.votes.no
  });

  if (totalVotes > 0) {
    const yesPercentage = (submission.votes.yes / totalVotes) * 100;
    console.log("Yes percentage:", yesPercentage);

    if (yesPercentage >= VERIFICATION_THRESHOLD) {
      console.log("Submission approved - uploading to Lighthouse");
      try {
        const uploadResponse = await uploadToLighthouse(submission);
        await handleVerifiedSubmission(submission, uploadResponse);
      } catch (error) {
        console.error("Error uploading to Lighthouse:", error);
      }
    } else {
      console.log("Submission rejected - deleting submission");
      // Still reward majority voters before deleting
      await rewardMajorityVoters(submission);
      await submission.deleteOne();
    }
  } else {
    console.log("No votes received - deleting submission");
    await submission.deleteOne();
  }
};

// Function to download a file from Lighthouse
const downloadFile = async (cid) => {
  try {
    const response = await fetch(
      `https://gateway.lighthouse.storage/ipfs/${cid}`
    );
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

// Function to get combined verified information
const getCombinedVerifiedInfo = async () => {
  const verifiedInfos = await VerifiedInfo.find();
  const combinedData = [];

  for (const info of verifiedInfos) {
    try {
      const submissionData = await downloadFile(info.lighthouseHash);
      combinedData.push({
        ...submissionData,
        verifiedAt: info.verifiedAt,
        lighthouseHash: info.lighthouseHash,
      });
    } catch (error) {
      console.error(`Error downloading hash ${info.lighthouseHash}:`, error);
      continue;
    }
  }

  return combinedData;
};

module.exports = {
  uploadToLighthouse,
  handleVerifiedSubmission,
  processExpiredSubmission,
  downloadFile,
  getCombinedVerifiedInfo,
};
