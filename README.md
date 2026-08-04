# lean
A lean development tool.

## Packages

- [@vainjs/eslint-config](packages/eslint-config/README.md)
- [@vainjs/lean-cli](packages/lean-cli/README.md) · [中文文档](packages/lean-cli/README-zh_CN.md)

## Release

This repository uses [Changesets](https://github.com/changesets/changesets) to version and publish packages in the monorepo.

1. Create a changeset locally:

   ```bash
   pnpm changeset
   ```

   Select the package to release, choose the version bump type, and write the release note. To release only one package, select only that package.

2. Commit and push the generated `.changeset/*.md` file to `main`.

3. Open the [Release workflow](.github/workflows/release.yml) in GitHub Actions and click **Run workflow**. Changesets creates or updates a release pull request containing the version and changelog updates.

4. Merge the release pull request, then run the **Release** workflow again. Changesets publishes the packages whose versions are newer than the versions currently published to npm and creates the corresponding GitHub Releases.

The workflow requires the repository `NPM_TOKEN` secret. `GITHUB_TOKEN` is provided by GitHub Actions automatically.
