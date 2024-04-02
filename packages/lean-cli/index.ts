#!/usr/bin/env node
import { Command } from "commander";
// import spawn from 'cross-spawn';
// import fs from 'fs';
import packageJson from "./package.json";

const program = new Command();

program.version(packageJson.version, "-v, --version");

program
  .command("create <projectName>")
  .description("create new project")
  .option("-t, --template <template>", "vue3,react,npm", "npm")
  .action(function (projectName, template) {
    console.log(projectName, template);
  });

// program
//   .command('dev')
//   .description('')
//   .action();

// program
//   .command('build')
//   .description('')
//   .option('-f, --format <format>', '需要构建的包方式', 'esm')
//   .option('-m, --mf')
//   .action(runBuild);

// program.command('analyse').description('analyse dependencies').action(runAnalyse);

// program.command('lint').description('lint').action(runLint);

program.parse(process.argv);
