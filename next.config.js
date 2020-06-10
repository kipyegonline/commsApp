module.exports = {
  module: {
    rules: [
      {
        test: /\.csv$/,
        use: [
          {
            loader: "file-loader",
            name: "[name].[ext]",
            outputPath: "csv",
            publicPath: "./public/",
          },
        ],
      },
    ],
  },
};
