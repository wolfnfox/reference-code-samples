import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/schema.graphql',
  generates: {
    './src/generated/graphql/schema.d.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../../context#Context',
      },
    },
  },
};

export default config;
