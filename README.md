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
3. Fill the `.env` file with the necessary credentials, you can decide how strict or flexible the values you provide will be
4. Install the project dependencies by running the command `npm install` or `yarn install`
5. Run the command `docker compose up` to start up the **Database**, **Adminer - a tool to visualize the data in the database**, and the Local Development Server
   **NB:** The command in **Step 5** would take a considerable amount of time when it is run for the first time, this time will reduce drastically when run subsequently
6. Relax and Sip some coffee while you got through the code
