# Good News: [v2 is in the making](https://twitter.com/matthiashalfmnn/status/1370691356679569412)

![version badge](https://img.shields.io/badge/Good%20News-brightgreen)
[![discord badge](https://img.shields.io/badge/Join%20Discord-brightgreen?&color=7289da&logo=discord&logoColor=white)](https://discord.gg/9NhwCuGR8E)

Transflow v2 is currently being developed in a different private repository until release. This repo contains the source code the old, no longer maintained version of Transflow.

Feel free to ask me anything on my [Twitter](https://twitter.com/matthiashalfmnn). You can also follow to stay up-to-date and get notified about upcoming app showcases and beta testings.

→ Most recent app demo: https://twitter.com/matthiashalfmnn/status/1370691356679569412

# ftp / [transflow](https://transflow.co)

React based Electron (S)FTP desktop application like FileZilla for uploading local files to a remote server.

###### Notice: This app is still in beta and highly unstable

![showcase](https://cdn.transflow.co/static/42vkW/showcase.gif)

## Installation

**Important:** The source code of this app is deprecated in favor of v2 rewrite. It's recommended to wait until v2 is being released. Follow me on [Twitter](https://twitter.com/matthiashalfmnn) to stay up-to-date and get notified about upcoming previews, betas and release dates.

### Install packages

```
npm install
```

## Development

**Note:** Electron is a framework used to guarantee cross-platform support for desktop apps. This app is mainly developed on macOS and not well tested on other OSs yet. Some small configurations might be necessary.

#### 1. Start Dev Server

```
npm run start
```

You will see an error in browser. You can ignore it.

**Note**: If this command fails, you could try building the app instead of starting it in development mode. See [Packaging](https://github.com/matthiaaas/ftp#packaging)

#### 2. Start in Electron

```
npm run electron-start
```

## License

#### [MIT License](https://github.com/matthiaaas/ftp/blob/master/LICENSE)

## Terms

In addition to the license: There's no liability for data loss, security issues, software abuse, etc.

## Usage

[Manual](https://github.com/matthiaaas/ftp/blob/master/MANUAL.md)

## Packaging

```
npm run electron-pack
```

**Note:** This will perform packaging for your platform. More info on building for different platforms [Multi-Platform-Build Docs](https://www.electron.build/multi-platform-build) using electron-builder.

## Contributing

Because the app is in an early stage, fundamental changes in design as well as in backend are possible and welcome.

### Development

When adding, improving features or fixing bugs, just start a pull request for review. Please append a detailed description of changes.

### UI/UX improvements

If you got any ui/ux ideas, wishes or improvements, start an issue with design material or references. For small changes in the source code, feel free to start a pull request.
Or reach out to me and get in touch [Twitter](https://twitter.com/matthiashalfmnn)
