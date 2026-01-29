module.exports = {
  plugins: [
    "@tailwindcss/postcss",
    ...(process.env.NODE_ENV === 'production' ? [
      [
        "postcss-url",
        {
          filter: '**/*',
          url: (asset) => `/wkd2ev${asset.url}`,
        },
      ]
    ] : []),
  ],
};
