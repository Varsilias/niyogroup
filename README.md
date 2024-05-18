# Niyo Group Backend Developer Assessment

#### Local Development Setup

These are all the steps that you should follow to successfully set up this project on your local machine. These processes should work across all machines that have [NodeJS](https://nodejs.org/en) and [Docker](https://www.docker.com/) Installed. Don't panic if you do not have these tools installed, here is a link to download each one.

Chances are you found this project on GitHub Which means you should have Git Installed and also know how to use Git for Version Control. In a case you do not, I have also attached a link to Download Git to your Machine.

[Link to download the LTS (Long Term Support) version of NodeJS](https://nodejs.org/en/download/package-manager)
[Link to download Docker for any platform of your choice](https://www.docker.com/products/docker-desktop/)
[Link to download Git](https://git-scm.com/downloads)

If you require a refresher on Git I recommend this tutorial from W3Schools - [Git Tutorial](https://www.w3schools.com/git/)

**Setup Steps**

1. Clone this project from GitHub with the command `git clone git@github.com:Varsilias/niyogroup.git`
2. Create a `.env` file that follows the blueprint of the `.env.example` file located at the root of the project directory by running the command `npm run copy:env` or `yarn copy:env`
3. Fill the `.env` file with the rest of the necessary credentials
4. Install the project dependencies by running the command `npm install` or `yarn install`
5. Run the command `docker compose up` to start up the **Database**, **Adminer - a tool to visualize the data in the database**, and the Local Development Server
   **NB:** The command in **Step 5** would take a considerable amount of time when it is run for the first time, this time will reduce drastically when run subsequently
   **NB** If you add an additional dependency to the core project, you have restart the local development server. Run the command `docker compose down` to stop all the containers and `docker compose up --build` to start the project
6. Relax and Sip some coffee while you go through the code

**Working With Mirgations**
When you move to production you definitely should set the `DB_SYNC` environment variable to **false**. This is to prevent unexpected changes to be automatically applied to your production database which could potentially lead to loss of data. In a case like this, you can use migrations to apply changes to the database.
This project provides up to four commands to use in generating and running migrations

1. `npm run migration:create --name=<NameOfFile>` to create a new empty migration file like this: **NameOfFile[timestamp]** where [timestamp] is the current time when the file was generated in milliseconds. The generated file includes an `up` and `down` method. the _up_ method apply changes to the database and the _down_ method rollback previously applied changes
2. `npm run migration:generate --name=<NameOfFile>` to generate a migration file based on existing Entity files. It compares current snapshots of the entities to previous snapshots of the same entities and generates corresponding `ALTER` statements to apply specific changes to the tables
3. `npm run migration:revert` to revert any migration file create by the `migration:create` and `migration:generate` command
4. `npm run migration:run` to run any migration that have not been previously applied.
