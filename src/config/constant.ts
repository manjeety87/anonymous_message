const { MONGODB_URI, RESEND_API_KEY, NEXTAUTH_SECRET, OPENAI_API_KEY } = process.env;

const mongodbURI = MONGODB_URI;
const resendAPIKey = RESEND_API_KEY;
const nextAuthSecret = NEXTAUTH_SECRET;
const openAiApiKey = OPENAI_API_KEY;

export { mongodbURI, resendAPIKey, nextAuthSecret, openAiApiKey };
