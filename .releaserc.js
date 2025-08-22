module.exports = {
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
          // Update manifest.json version
          "node -e \"const fs = require('fs'); const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8')); manifest.version = '${nextRelease.version}'; fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));\"",
          // Update Firefox manifest version
          "node -e \"const fs = require('fs'); const manifest = JSON.parse(fs.readFileSync('manifest(firefox).json', 'utf8')); manifest.version = '${nextRelease.version}'; fs.writeFileSync('manifest(firefox).json', JSON.stringify(manifest, null, 2));\"",
          // Update package.json version
          'npm version ${nextRelease.version} --no-git-tag-version',
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
          'CHANGELOG.md',
        ],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
