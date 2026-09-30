import type { NextConfig } from "next";

// GitHub Pages project site: https://teddyhuang.is-a.dev/nc-dmv-prep/
import { BASE_PATH } from "./src/lib/config";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
};

export default nextConfig;
