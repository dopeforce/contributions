/*
 * GitHub Contribution Commit Script - Important Notes:
 *
 * 1. Make sure your Git user.name and user.email match your GitHub account exactly.
 * 2. Commit dates must be within the last 365 days to appear on your contribution graph.
 * 3. Each commit must change the file content to be recognized by Git.
 * 4. Push commits to your default branch (usually "main" or "master").
 * 5. Your local repository must be linked correctly to your GitHub remote ("origin").
 * 6. Commits should be made sequentially to avoid conflicts (use async/await).
 * 7. GitHub may take a few minutes to update the contribution graph after pushing.
 * 
 */

import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();
// Set Git user config once before commits (change to your GitHub credentials)
// Command to check your github credentials in bash        // git config --global --list
await git.addConfig("user.name", "Your GitHub Name");      // git config --global user.name
await git.addConfig("user.email", "your@email.com");       // git config --global user.email

/*
 * markCommit(x, y):
 * Creates a single commit at a specific week (x) and day (y) relative to one year ago.
 * x: week index (0-52)
 * y: day of the week (0=Sunday, 6=Saturday)
 */
const markCommit = async (x, y) => {
    // Calculate date based on x weeks and y days ago from 364 days back
    const date = moment().startOf("day").subtract(364 - (x * 7 + y), "days");
    const isoDate = date.toISOString();
    // Write data.json with date and random number to force file change
    const data = {
        date: isoDate,
        random: Math.random()
    };
    await jsonfile.writeFile(path, data);
    await git.add(path);
    await git.commit(isoDate, { "--date": isoDate });
    await git.push("origin", "main");
};

/*
 * makeCommits(n):
 * Creates n commits randomly distributed over the last year.
 * Commits are made sequentially and pushed at the end.
 */
const makeCommits = async (n) => {
    if (n === 0) {
        await git.push("origin", "main");
        return;
    }
    // Random day within last 365 days
    const date = moment().startOf("day").subtract(random.int(0, 364), "days");
    const isoDate = date.toISOString();
    const data = {
        date: isoDate,
        random: Math.random()
    };
    await jsonfile.writeFile(path, data);
    await git.add(path);
    await git.commit(isoDate, { "--date": isoDate });
    await makeCommits(n - 1); // Await recursive call for sequential commits
};

// Example usage:
markCommit(2, 10); // single commit at week 2, day 10
makeCommits(10);   // create 10 random commits over the last year
