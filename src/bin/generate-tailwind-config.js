#!/usr/bin/env node

// This is a JavaScript file that will be compiled to dist/bin/generate-tailwind-config.js
// It serves as the CLI entry point for the generate-tailwind-config functionality

const { generateTailwindConfigCLI } = require('../utils/generate-tailwind-config.js');

// Run the CLI function
generateTailwindConfigCLI();
