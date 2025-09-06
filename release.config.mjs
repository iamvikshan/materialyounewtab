export default {
  branches: ['main'],
  plugins: [
    [
      'semantic-release-gitmoji',
      {
        releaseRules: {
          patch: {
            include: [
              ':bug:',
              ':ambulance:',
              ':lock:',
              ':adhesive_bandage:',
              ':lipstick:',
              ':pencil2:',
            ],
          },
          minor: {
            include: [
              ':sparkles:',
              ':rocket:',
              ':zap:',
              ':globe_with_meridians:',
              ':wheelchair:',
              ':mag:',
            ],
          },
          major: {
            include: [':boom:', ':warning:'],
          },
        },
      },
    ],

    '@semantic-release/commit-analyzer',

    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        writerOpts: {
          types: [
            { type: 'feat', section: '✨ Features' },
            { type: 'fix', section: '🐛 Bug Fixes' },
            { type: 'perf', section: '⚡ Performance Improvements' },
            { type: 'revert', section: '⏪ Reverts' },
            { type: 'docs', section: '📚 Documentation' },
            { type: 'style', section: '💄 Styles' },
            { type: 'chore', section: '🔧 Miscellaneous' },
            { type: 'refactor', section: '♻️ Code Refactoring' },
            { type: 'test', section: '✓ Tests' },
            { type: 'build', section: '👷 Build System' },
            { type: 'ci', section: '🔄 CI/CD' },
            { type: 'i18n', section: '🌐 Internationalization' },
            { type: 'a11y', section: '♿ Accessibility' },
          ],
        },
      },
    ],

    [
      '@semantic-release/changelog',
      {
        changelogTitle:
          '# 📦 Changelog\n\nAll notable changes to this project will be documented in this file.\n',
      },
    ],

    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'materialyounewtab-chrome.zip', label: 'Chrome Extension' },
          { path: 'materialyounewtab-firefox.zip', label: 'Firefox Extension' },
        ],
        successComment:
          "🎉 This ${issue.pull_request ? 'PR is included' : 'issue has been resolved'} in version ${nextRelease.version} and is now available for download!",
        failTitle: '❌ The release failed',
        failComment:
          'The release from branch ${branch.name} failed to publish.',
        labels: ['released'],
      },
    ],

    [
      '@semantic-release/exec',
      {
        prepareCmd: [
          // Update manifest.json version (ESM inline)
          "node --input-type=module -e \"import { readFileSync, writeFileSync } from 'node:fs'; const manifest = JSON.parse(readFileSync('manifest.json', 'utf8')); manifest.version = '${nextRelease.version}'; writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));\"",
          // Update Firefox manifest version (ESM inline)
          "node --input-type=module -e \"import { readFileSync, writeFileSync } from 'node:fs'; const manifest = JSON.parse(readFileSync('manifest(firefox).json', 'utf8')); manifest.version = '${nextRelease.version}'; writeFileSync('manifest(firefox).json', JSON.stringify(manifest, null, 2));\"",
          // Update README.md version references
          "sed -i 's|(v[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+)|(v${nextRelease.version})|g' README.md",
          "sed -i 's|refs/tags/v[0-9]\\+\\.[0-9]\\+\\.[0-9]\\+\\.zip|refs/tags/v${nextRelease.version}.zip|g' README.md",
          // Update package.json version
          'npm version ${nextRelease.version} --no-git-tag-version',
          // Rebuild extension packages with updated versions
          'bun run clean && bun run build',
        ].join(' && '),
      },
    ],

    [
      '@semantic-release/git',
      {
        assets: [
          'package.json',
          'manifest.json',
          'manifest(firefox).json',
          'README.md',
          'CHANGELOG.md',
        ],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
