const config = {
  presets: [
    [
      '@babel/preset-env', // 使用 @babel/preset-env 转换语法
      {
        // 目标环境配置，根据需要调整
        targets: {
          browsers: [
            // 你可以指定具体的浏览器版本，例如：
            // "last 2 versions",
            // ">= 1%",
            // "Chrome >= 49",
            // "Firefox >= 45",
            // 或使用 "defaults" 自动选择一组常见的浏览器版本
            "defaults",
          ],
        },
        // 启用或禁用模块转换
        modules: false, // 或 "auto" / "commonjs"

        // 可选：按需加载 polyfills
        useBuiltIns: 'usage', // 根据代码实际使用情况自动引入 polyfills
        corejs: 3, // 如果使用按需加载，需要指定 core-js 的版本

        // 可选：包含或排除特定的 transforms
        // exclude: ['transform-regenerator'], // 例如，排除 regenerator 转换
        // include: ['@babel/plugin-proposal-class-properties'], // 或者包含额外的提案特性
      },
    ],
  ],

  // 可选：包含全局的 Babel 插件
  plugins: [
  ],
};

export default config