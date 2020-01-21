# pr-diverge-reminder

> A GitHub App built with [Probot](https://github.com/probot/probot) that A probot App reminds you when the base branch changes

# Usage 

There are a few assumptions to use this bot,
1. You use Github pull request in your workflow.
2. You prefer linear git history when incorporating the feature branch 
3. To accomplish step 2, you always use `git rebase` to update your pull request. 

If you sometimes forget to update your pull request before merging, this bot is perfect reminder for you,
it pings the author of the pull request when there are changes in the base branch, see the following snapshot:

<img src="https://raw.githubusercontent.com/xavierchow/asset/master/pr-diverge-reminder/usage.png" width="650">

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Contributing

If you have suggestions for how pr-base-reminder could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## Big Thanks
[Xincen](https://github.com/chiyokei) to provide the icon for this bot.

## License

[ISC](LICENSE) © 2020 Xavier Zhou <xiayezhou@gmail.com>
