# ftp / [transflow](https://transflow.co)

React based Electron (S)FTP desktop application like FileZilla for uploading local files to a remote server.

###### Notice: This app is still in beta and highly unstable

![showcase](https://transflow.co/static/media/showcase.gif)

## Installation

**Note:** If you want to download the app for real every-day usage / testing it's not recommended to build from the GitHub repo. Visit [transflow.co/download](https://transflow.co/download) instead.

### Requirements

* npm

### Packages

* React >16.12
* Electron >8.0

### Installing

```
npm install
```

## Development

**Note:** Electron is a framework used to guarantee cross-platform support for desktop apps. This app is mainly developed on macOS and not well tested on other OSs yet. Some small configurations might be necessary.

#### 1. Start in your browser

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

**Note:** This app is **not** publicly **released** yet. Keep the code private. Do not pass it to third parties. Do not publish any details referencing this repository or its idea.

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
