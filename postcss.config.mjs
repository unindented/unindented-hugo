import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from "tailwindcss";

const tailwindConfig = process.env.HUGO_FILE_TAILWIND_CONFIG_JS || "./tailwind.config.js";

export default {
  plugins: [
    tailwindcss(tailwindConfig),
    autoprefixer,
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [cssnano] : []),
  ],
};
