module.exports = {
  outputDir: "docs",
  publicPath:
    process.env.NODE_ENV === "production" ? "/vuetify-week-scheduler/" : "/",
  transpileDependencies: ["vuetify"],
};
