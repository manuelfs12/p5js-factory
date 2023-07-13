#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import welcome from "cli-welcome";
import pkg from "../package.json" assert { type: "json" };

const repoUrl = "https://api.github.com/repos/processing/p5.js/releases/latest";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

welcome({
  title: "P5js Factory",
  tagLine: "By Manuel Figueroa",
  description: pkg.description,
  version: pkg.version,
  bgColor: "#ef4275",
  color: "#FFFFFF",
});

inquirer
  .prompt({
    type: "input",
    name: "directoryName",
    message: "Enter folder name:",
    default: "MyAwesomeSketch",
  })
  .then((answer) => {
    fs.mkdir(path.join(process.cwd(), answer["directoryName"]), (err) => {
      if (err) {
        return console.error(err);
      }
      const directoryName = `./${answer["directoryName"]}`;
      fs.cp(
        path.join(`${__dirname}/templates`),
        directoryName,
        { recursive: true },
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      axios
        .get(repoUrl)
        .then(async (res) => {
          const p5MinDownloadLink = res.data.assets[1].browser_download_url;
          const p5SoundMinDownloadLink =
            res.data.assets[3].browser_download_url;
          await downloadP5(
            res.data.assets[1]["name"],
            p5MinDownloadLink,
            directoryName
          );
          await downloadP5(
            res.data.assets[3]["name"],
            p5SoundMinDownloadLink,
            directoryName
          );
        })
        .then(() => {
          console.log("Project created successfully!");
          console.log(`cd ${directoryName}`);
          console.log(
            "Optionally you can install p5 type definitions running:"
          );
          console.log("npm i --save @types/p5");
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  })
  .catch((err) => {
    throw new Error(err);
  });

async function downloadP5(name, downloadLink, directoryName) {
  const p5MinResponse = await axios.get(downloadLink, {
    responseType: "text",
  });
  fs.writeFile(
    `${directoryName}/libraries/${name}`,
    p5MinResponse.data,
    (err) => {
      if (err) {
        throw new Error(err);
      }
    }
  );
}
