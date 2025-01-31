import type { GatsbyConfig } from "gatsby";
import path from "path";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `collaborative text editor`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: {
    typesOutputPath: "./types/gatsby-types.d.ts",
  },
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
        extensions: ["js", "jsx", "ts", "tsx"],
      },
    },
  ],
};

export default config;
