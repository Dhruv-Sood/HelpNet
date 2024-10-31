const lighthouse = require("@lighthouse-web3/sdk");
const mongoose = require("mongoose");
const { VERIFICATION_THRESHOLD } = require("./config");
const { Submission, VerifiedInfo } = require("./modals");

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
};

// Function to process expired submissions
const processExpiredSubmission = async (submission) => {
  const totalVotes = submission.votes.yes + submission.votes.no;
  if (totalVotes > 0) {
    const yesPercentage = (submission.votes.yes / totalVotes) * 100;

    if (yesPercentage >= VERIFICATION_THRESHOLD) {
      try {
        const uploadResponse = await uploadToLighthouse(submission);
        await handleVerifiedSubmission(submission, uploadResponse);
        // TODO: Future implementation
        // - Reward uploader for successful verification (>80% yes votes)
        // - Reward verifiers who voted with majority
      } catch (error) {
        console.error("Error uploading to Lighthouse:", error);
      }
    } else {
      await submission.deleteOne();
    }
  } else {
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
