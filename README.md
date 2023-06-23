# Twikkl API

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## TODO

- [x] Implement User Feed (Currently fetches all posts from users that the user follows, groups he is in, and sorts them by date. Would sort by likes and comments in the future.)
- [] Implement Pagination
- [] Remove password from responses
- [] Group only posts
- [] Test comments and likes
- [] Test repost
- [] Implement file upload
- [] Implement file streaming
- [] Implement file download
- [] Implement caching
