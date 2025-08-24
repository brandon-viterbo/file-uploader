import config from "eslint-config-xo";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores([".generate/*"])]);
