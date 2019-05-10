module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: [
        "> 85%",
        "last 20 versions",
        "not ie <= 8"
      ]
    })
  ]
};
