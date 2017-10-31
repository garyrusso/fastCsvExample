# fastCsvExample

This JavaScript command line program will:

1. read data from a csv file
1. convert csv to json
1. insert json into a MongoDB database

***

### <a name="prereqs">Install Required Dependencies</a>

To deploy and run the application you need:

- <a href="https://nodejs.org/" target="_blank">node.js</a> v8.1.4 or greater
- <a href="https://git-scm.com/" target="_blank">Git Bash Shell</a> v2.13.2.windows.1
- <a href="https://www.npmjs.com/" target="_blank">npm</a> v5.0.3 

***

### <a name="start">Commands to Get Started</a>

Steps:

 1. Get the latest code
 1. Open Git Bash Shell
 1. Run following command to get dependencies

        npm install

 1. Edit `ingest-config.json` to point to csv data file.

 1. Run following command

        node ingest-csv.js
