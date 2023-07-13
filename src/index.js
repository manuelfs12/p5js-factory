#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";

inquirer
  .prompt({ type: "input", name: "dirName", message: "Enter directory name:" })
  .then((answer) => {
    console.log(answer);
  })
  .catch((err) => {
    console.error(err);
  });
