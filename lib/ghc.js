'use babel'

const child_process = require('child_process');
const path = require('path')
const fs = require('fs')
const Ghci = require('./ghci')
const ghciPathProperty = 'tidalcycles-dsm0-fork.ghciPath'
const sclangPathProperty = 'tidalcycles-dsm0-fork.bootSclangPath'
const tidalPathProperty = 'tidalcycles-dsm0-fork.bootTidalPath'
const packagePath = atom.packages.getPackageDirPaths()[0].replace(/\\/g,"/") + "/tidalcycles-dsm0-fork/"; // replaces \ (used for paths on windows) with / (used for paths on other systmes) for compatability reasons

export default class Ghc {

  static interactive() {
    return new Ghci(
      child_process.spawn(Ghc.commandPath('ghci'), [], { shell: true })
      // child_process.spawn(Ghc.commandPath('ghci'), [], { shell: true })
    )
  }

  static browseTidal(callback) {
    let ghciPath = Ghc.commandPath('ghci')
    child_process.exec(`echo ":browse Sound.Tidal.Context" | ${ghciPath}`,
      (error, stdout) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        callback(stdout)
    })
  }

  static commandPath(name) {
    let tidalExecutable = Ghc.ghciPathProperty()
    let sclangValue = Ghc.sclangPathProperty()
    let tidalValue = Ghc.tidalPathProperty()

    commandArgs = ["--supercolliderBootPath", sclangValue ,
                   "--tidalBootPath"          , tidalValue ].join(" ")
    command = tidalExecutable + " " + commandArgs

    console.log("bootCommand: " + command)
    return command
  }

  static tidalDataDir() {
    try {
      let dataDir = child_process
        .execSync(`ghc-pkg field tidal data-dir`)
        // .execSync(`${Ghc.commandPath('ghc-pkg')} field tidal data-dir`)
        .toString().trim()

      return dataDir.substring(dataDir.indexOf(' ') + 1)
    } catch (err) {
      console.error(`Error get tidal data-dir: ${err}`)
      return ''
    }

  }

  static ghciPathProperty() {
    return (atom.config.get(tidalPathProperty))
      ? atom.config.get(tidalPathProperty)
      : "tidal"
  }

  static sclangPathProperty() {
    return (atom.config.get(tidalPathProperty))
      ? atom.config.get(tidalPathProperty)
      : packagePath + "./lib/startup.scd"
  }

  static tidalPathProperty() {
    return (atom.config.get(tidalPathProperty))
      ? atom.config.get(tidalPathProperty)
      : packagePath + "./lib/BootTidal.hs"
  }

}
