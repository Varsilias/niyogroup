# Niyo Group Backend Developer Assessment

#### Local Development Setup

**Prerequisites:** Ensure that ports **3000**, **8080** and **5432** are free on your local machine, if not look at step 5 in **Setuo Steps** to see how to make them free

These are all the steps that you should follow to successfully set up this project on your local machine. These processes should work across all machines that have [NodeJS](https://nodejs.org/en) and [Docker](https://www.docker.com/) Installed. Don't panic if you do not have these tools installed, here is a link to download each one.

Chances are you found this project on GitHub Which means you should have Git Installed and also know how to use Git for Version Control. In a case you do not, I have also attached a link to Download Git to your Machine.

- [Link to download the LTS (Long Term Support) version of NodeJS](https://nodejs.org/en/download/package-manager)
- [Link to download Docker for any platform of your choice](https://www.docker.com/products/docker-desktop/)
- [Link to download Git](https://git-scm.com/downloads)

If you require a refresher on Git I recommend this tutorial from W3Schools - [Git Tutorial](https://www.w3schools.com/git/)

**Setup Steps**

1. Clone this project from GitHub with the command `git clone git@github.com:Varsilias/niyogroup.git`
2. Create a `.env` file that follows the blueprint of the `.env.example` file located at the root of the project directory by running the command `npm run copy:env` or `yarn copy:env`
3. Fill the `.env` file with the rest of the necessary credentials
4. Install the project dependencies by running the command `npm install` or `yarn install`
5. If the ports listed in the **prerequisites** section above are not free, run the command `npm run kill:ports` or `yarn kill:ports` in Gitbash terminal on windows or any terminal of your choice in MacOS or Linux
6. Run the command `docker compose up` to start up the **Database**, **Adminer - a tool to visualize the data in the database**, and the Local Development Server

**NB:** The command in **Step 6** would take a considerable amount of time when it is run for the first time, the time will reduce drastically when run subsequently

**NB** If you add an additional dependency to the core project, you have restart the local development server. Run the command `docker compose down` to stop all the containers and `docker compose up --build` to start the project

7. `npm run test` run all the test cases in this project

8. To see the your database table and data in each table go to [http://localhost:8080](http://localhost:8080) select **PostgreSQL** as the System, leave the **Server** field as is, proceed to fill in the rest of the input field. See the image below for reference

**NB:** The value for the rest of the input field come from your `.env`. DB_USER value for the Username field, DB_NAME for the Database field, DB_PASSWORD for the Password field

![Adminer Login Screen](https://github.com/Varsilias/niyogroup/blob/main/adminer.png)

9. Relax and Sip some coffee while you go through the code

**Working With Migrations**
When you move to production you definitely should set the `DB_SYNC` environment variable to **false**. This is to prevent unexpected changes to be automatically applied to your production database which could potentially lead to loss of data. In a case like this, you can use migrations to apply changes to the database.
This project provides up to four commands to use in generating and running migrations

1. `npm run migration:create --name=<NameOfFile>` to create a new empty migration file like this: **NameOfFile[timestamp]** where [timestamp] is the current time when the file was generated in milliseconds. The generated file includes an `up` and `down` method. the _up_ method apply changes to the database and the _down_ method rollback previously applied changes
2. `npm run migration:generate --name=<NameOfFile>` to generate a migration file based on existing Entity files. It compares current snapshots of the entities to previous snapshots of the same entities and generates corresponding `ALTER` statements to apply specific changes to the tables
3. `npm run migration:revert` to revert any migration file create by the `migration:create` and `migration:generate` command
4. `npm run migration:run` to run any migration that have not been previously applied.

#### Data Model

![Niyo Group Assessment Data Model](https://github.com/Varsilias/niyogroup/blob/main/niyogroup.png)

#### API Endpoint Documentation

[Link to Postman Documentation Page](https://documenter.getpostman.com/view/10967402/2sA3QmEEvw#a0cdf10f-e65f-4691-a234-45c08c65d693)

#### WebSocket Setup

1. Run the command `npm run start:socket` to start the test websocket client

When a new task is created on the server, an event `task/new` is emitted to the client which it listens to, the event is emitted alongside the newly created task.
The new task is automatically appended to the html page alongside previously sent tasks. You can test this out by sending a **HTTP request** to create a new task from any **HTTP Client** of your choice **E.G Postman** go back to the HTML page rendered when you ran the command in **step 1** and you will see the new task appended to the page in real-time
