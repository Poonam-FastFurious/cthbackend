// controllers/smsController.js
import AWS from "aws-sdk";

// AWS configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const pinpoint = new AWS.Pinpoint();

// Helper function to generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Controller function to send OTP SMS
const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOtp();

  // Save OTP in your database/cache if needed for verification purposes

  const params = {
    ApplicationId: "625b5cba0dae444795ef5a975d2c1e13", // Replace with your Pinpoint Application ID
    MessageRequest: {
      Addresses: {
        [phoneNumber]: {
          ChannelType: "SMS",
        },
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: `Your OTP code is ${otp}`,
          MessageType: "TRANSACTIONAL", // Transactional for OTPs
        },
      },
    },
  };

  try {
    const response = await pinpoint.sendMessages(params).promise();
    console.log(
      "OTP sent response:",
      JSON.stringify(response.MessageResponse.Result, null, 2)
    );
    res.status(200).json({ message: "OTP sent successfully!", otp }); // Send the OTP only for debugging (remove in production)
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

export { sendOtp };
