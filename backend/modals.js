const mongoose = require("mongoose");
const submissionSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  category: String,
  sender: String,
  votes: {
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
  },
  voters: [
    {
      address: String,
      vote: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
});

const Submission = mongoose.model("Submission", submissionSchema);

const verifiedInfoSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission",
  },
  lighthouseHash: String,
  verifiedAt: { type: Date, default: Date.now },
});

const VerifiedInfo = mongoose.model("VerifiedInfo", verifiedInfoSchema);

module.exports = {
  Submission,
  VerifiedInfo,
};
