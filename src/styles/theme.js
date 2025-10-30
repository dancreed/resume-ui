export const theme = {
  orange: process.env.REACT_APP_PRIMARY_COLOR || "#ff7000",
  white: "#fff",
  gray: "#f9f9fc",
  inputBorder: process.env.REACT_APP_SECONDARY_COLOR || "#ffb066",
  buttonHover: "#ffa540"
};

export const urls = {
  profile: process.env.REACT_APP_PROFILE_IMAGE_URL || "https://resume-worker.dan-creed.workers.dev/profile.jpg",
  badge: process.env.REACT_APP_BADGE_IMAGE_URL || "https://images.credly.com/images/9a698c36-3b13-48b4-a3bf-8a070d5000a6/image.png",
  api: process.env.REACT_APP_API_URL || "/ask"
};
