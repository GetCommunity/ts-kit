import gcPrettierApp from "@getcommunity/config-prettier/app.js"

export default {
  ...gcPrettierApp,
  plugins: ["@prettier/plugin-xml"]
}
