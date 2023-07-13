#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import axios from "axios";

const repoUrl = "https://api.github.com/repos/processing/p5.js/releases/latest";
inquirer
  .prompt({
    type: "input",
    name: "directoryName",
    message: "Enter directory name:",
  })
  .then((answer) => {
    fs.mkdir(path.join(process.cwd(), answer["directoryName"]), (err) => {
      if (err) {
        return console.error(err);
      }
      fs.cp(
        "./src/templates",
        `./${answer["directoryName"]}`,
        { recursive: true },
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
      axios.get(repoUrl).then(async (res) => {
        console.log(res.data.assets[1]["name"]);
        console.log(res.data.assets[3]["name"]);
        const p5MinDownloadLink = res.data.assets[1].browser_download_url;
        const p5SoundMinDownloadLink = res.data.assets[3].browser_download_url;
        await downloadP5(res.data.assets[1]["name"], p5MinDownloadLink);
        await downloadP5(res.data.assets[3]["name"], p5SoundMinDownloadLink);
      });

      console.log("Directory created successfully!");
    });
  })
  .catch((err) => {
    console.error(err);
  });

async function downloadP5(name, downloadLink) {
  const p5MinResponse = await axios.get(downloadLink, {
    responseType: "text",
  });
  fs.writeFile(`${name}`, p5MinResponse.data, (err) => {
    console.log(err);
  });
}
