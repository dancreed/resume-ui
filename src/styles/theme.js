export const theme = {
  // Allison Transmission Red
  orange: process.env.REACT_APP_PRIMARY_COLOR || "#E31837",
  white: "#fff",
  gray: "#f0f2f5", // Slight off-white/gray for backgrounds
  inputBorder: process.env.REACT_APP_SECONDARY_COLOR || "#004B87", // Allison Blue
  buttonHover: "#C4122D", // Darker red for hover
  // You can add specific blue if needed elsewhere
  blue: "#003366",
};

export const urls = {
  profile: process.env.REACT_APP_PROFILE_IMAGE_URL || "https://resume-worker.dan-creed.workers.dev/profile.jpg",
  badge: process.env.REACT_APP_BADGE_IMAGE_URL || "https://images.credly.com/images/9a698c36-3b13-48b4-a3bf-8a070d5000a6/image.png",
  api: process.env.REACT_APP_API_URL || "/ask"
};
