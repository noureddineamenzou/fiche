# Contributing

## Reporting Bugs

When submitting a new bug report, please first search for an existing or similar report & then use one of our existing issue templates if you believe you've come across a unique problem. Duplicate issues, or issues that don't use one of our templates may get closed without a response.

## Development

**1. Clone this repository...**

```bash
$ git clone git@github.com:mbirali/angular-starter.git
```

**2. Navigate into project & install development-specific dependencies...**

```bash
$ cd angular-starter
```
```bash
$ npm install
```

**3. Write some code &/or add some tests...**

```bash
...
```

**4. Run tests & ensure they pass...**

```
$ npm run test
```

**5. Open a Pull Request for your work & become the newest contributor! 🎉**

## Pull Request Conventions

We use Conventional Commits. When opening a pull request, please be sure that each commit in the pull request, has one of the following prefixes:

- `feat`: For when introducing a new feature. The result will be a new semver minor version of the package when it is next published.
- `fix`: For bug fixes. The result will be a new semver patch version of the package when it is next published.
- `docs`: For documentation updates. The result will be a new semver patch version of the package when it is next published.
- `chore`: For changes that do not affect the published module. Often these are changes to tests. The result will be _no_ change to the version of the package when it is next published (as the commit does not affect the published version).

## What _not_ to contribute?

### Dependencies

It should be noted that our team does not accept third-party dependency updates/PRs. We use dependabot to ensure dependencies are staying up-to-date & will ship security patches for CVEs as they occur. If you submit a PR trying to update our dependencies we will close it with or without a reference to these contribution guidelines.

### Tools/Automation

Our core team is responsible for the maintenance of the tooling/automation in this project & we ask collaborators to kindly not make changes to these when contributing (ex. `.github/*`, `.eslintrc.json`, package.json `scripts`, etc.)