const { MONGODB_URI, RESEND_API_KEY, NEXTAUTH_SECRET } = process.env;

const mongodbURI = MONGODB_URI;
const resendAPIKey = RESEND_API_KEY;
const nextAuthSecret = NEXTAUTH_SECRET;

export { mongodbURI, resendAPIKey, nextAuthSecret };