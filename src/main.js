const filepath = "./inc/GithubCommits.json";
const jsonfile = require("jsonfile");
const moment = require("moment");
const simpleGit = require("simple-git");
const GithubCommits = (n) => {
    if (n === 0) {
        console.log('\x1b[36mFinished committing | Pushing to remote...\x1b[0m');
        return simpleGit().push((err) => {
            if (err) {
                console.error("Push Failed :", err);
            } else {
                console.log('\x1b[1m\x1b[33mAll commits pushed successfully\x1b[0m');
            }
            process.exit(0);
        });
    }
    const x = Math.floor(Math.random() * 55);
    const y = Math.floor(Math.random() * 7);
    const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d");
    if (date.isAfter(moment())) {
        date.set({ hour: moment().hour(), minute: moment().minute(), second: moment().second() });
    }
    const dateFormatted = date.format();
    const commits = { date: dateFormatted };
    jsonfile.writeFile(filepath, commits, (err) => {
        if (err) {
            console.error(`Failed to write to ${filepath}:`, err);
            return;
        }
        simpleGit().add([filepath]).commit(dateFormatted, { "--date": dateFormatted }, (err, result) => {
            if (err) {
                console.error("Github Commit Failed : ", err);
                return;
            }
            console.log(`\x1b[1m\x1b[33mcommit:\x1b[0m ${dateFormatted}   \x1b[1m\x1b[92mcommitted\x1b[0m`);
            GithubCommits(n - 1);
        });
    });
};
GithubCommits(10);