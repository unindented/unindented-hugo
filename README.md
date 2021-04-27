# Unindented (Website)

This is the source code for my website, [unindented.org](https://www.unindented.org/).

The contents themselves are versioned separately as a submodule. You can find them at <https://github.com/unindented/unindented-contents>.

## Prerequisites

- [Hugo](https://gohugo.io/) - `brew install hugo`
- [GNU Make](https://www.gnu.org/software/make/) - `brew install make`
- [Gzip](https://www.gnu.org/software/gzip/) - `brew install gzip`
- [Brotli](https://github.com/google/brotli) - `brew install brotli`
- [ImageMagick](https://imagemagick.org/) - `brew install imagemagick`
- [WebP](https://developers.google.com/speed/webp) - `brew install webp`
- [cavif](https://github.com/kornelski/cavif-rs) - `brew install nasm && cargo install cavif`

## Develop

To develop the site, do:

```
$ make server
```

## Build

To build the site for development, do:

```
$ make build-dev
```

To build the site for production, do:

```
$ make build-prod
```

## Deploy

To deploy the site for development, do:

```
$ make deploy-dev
```

To deploy the site for production, do:

```
$ make deploy-prod
```

## Meta

- Code: `git clone https://github.com/unindented/unindented-hugo.git`
- Home: <https://www.unindented.org/>

## Contributors

Daniel Perez Alvarez ([daniel@unindented.org](mailto:daniel@unindented.org))

## License

Copyright (c) 2021 Daniel Perez Alvarez ([unindented.org](https://www.unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
