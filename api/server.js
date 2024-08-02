import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'otpless-node-js-auth-sdk';
const { sendOTP, verifyOTP } = pkg;
import { v4 as uuidv4 } from 'uuid';

const app = express();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
    const { phoneNumber, channel } = req.body;

    const hash = 'appHashValue';
    const orderId = uuidv4(); // Generate a unique orderId
    const expiry = 300; // expiry time in seconds
    const otpLength = 6; // length of the OTP
    const clientId = '67XL76LDX98MFKB2C7JX9SMRUAHHTG7K';
    const clientSecret = 'x2r8rdvomxhz6flt8ul7uhimsx7jfapa';

    try {
        const response = await sendOTP(phoneNumber, undefined, channel, hash, orderId, expiry, otpLength, clientId, clientSecret);
        res.json({ success: true, response, orderId }); // Include orderId in the response for verification
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, error });
    }
});

// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body; // Simplified request payload
    const orderId = req.body.orderId; // Assuming orderId is sent along with phone number and OTP for verification
    const clientId = '67XL76LDX98MFKB2C7JX9SMRUAHHTG7K';
    const clientSecret = 'x2r8rdvomxhz6flt8ul7uhimsx7jfapa';

    try {
        const response = await verifyOTP(undefined, phoneNumber, orderId, otp, clientId, clientSecret);
        res.json({ success: true, response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, error });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
