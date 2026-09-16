export default {
  source: ['docs/design-system/tokens/**/*.json'],
  usesDtcg: true,
  platforms: {
    css: { transformGroup: 'css', buildPath: 'src/styles/generated/css/', files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }] },
    ts: { transformGroup: 'js', buildPath: 'src/styles/generated/ts/', files: [{ destination: 'tokens.ts', format: 'javascript/es6' }, { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' }] }
  }
};
