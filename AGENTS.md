# Agents Overview

This document explains the purpose, responsibilities, and interactions of the code used in this project.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

This repository contains:

- An **npm package** providing the core package logic (`/src`).
- A **Next.js demo app** (`/demo-app`) that showcases the package and allows for testing once built.
- A **README.md** (`README.md`) that defines how the package should be integrated into a next js application. This is also used on the application.

## Architecture

- **`/.github/`** folder with actions used for CI/CD
- **`/demo-app/`** folder with a local next.js application that is used for non production testing. This isn't part of the package
- **`/dist/`** folder with exports for the npm package `next-markdown-blog` in complied javascript
- **`/src/`** folder contains logic and components for the package. These are complied to JS and shipped from `/dist/`
- **`/tests/`** foldering containing unit and integration tests

## Testing

- `npm run test` - Should run tests with no errors
- `npm run lint` - Should have no errors or warning
- `npm run format` - Should have no errors or warning
- `npm run type-check` - Should pass without errors
- Please ensure any changes to logic are also reflected in the `README.md`
