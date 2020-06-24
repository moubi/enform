module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { ie: 11 },
        useBuiltIns: "usage"
      }
    ],
    "@babel/preset-react"
  ],
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          { targets: { node: "current" }, modules: "commonjs" }
        ]
      ]
    }
  }
};
