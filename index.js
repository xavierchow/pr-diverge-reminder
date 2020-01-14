/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
const R = require('ramda')
module.exports = app => {
  app.log('Base change reminder was loaded!')

  function getBasic (payload) {
    const repo = payload.repository
    const { owner } = repo
    return { repo: repo.name, owner: owner.login }
  }

  async function remind (octokit, basic, pr) {
    const author = R.path(['user', 'login'], pr)
    const comment = `Diverged with base branch, rebase to keep up-to-date. @${author}`
    return octokit.issues.createComment(R.mergeLeft(basic, { issue_number: pr.number, body: comment }))
  }

  app.on('push', async context => {
    const push = context.payload
    const basic = getBasic(push)
    const base = R.replace(/refs\/heads\//g, '', push.ref)
    if (R.not(R.test(/master|dev/, base))) {
      return
    }
    app.log('Receiving push with base = %j', base)
    try {
      const pulls = R.prop('data',
        (await context.github.pulls.list(R.mergeLeft(basic, { state: 'open', base: base }))))
      return await Promise.all(R.map(R.curry(remind)(context.github, basic), pulls))
    } catch (e) {
      app.log('Error when commenting = %j', e)
    }
  })
  app.on('pull_request.opened', async context => {
    const basic = getBasic(context.payload)

    const pr = R.prop('pull_request', context.payload)
    const base = R.prop('base', pr)

    app.log('Receiving pr.opened with base = %j', base.sha)
    // compare base branch head with parents of the 1st commit of PR
    const commits = R.prop('data',
      await context.github.pulls.listCommits(R.mergeLeft(basic, { pull_number: pr.number })))
    const shas = R.map(R.prop('sha'), R.prop('parents', R.nth(0, commits)))
    app.log('parents sha = %j', shas)
    const isFastForward = R.includes(base.sha, shas)
    if (!isFastForward) {
      await remind(context.github, basic, pr)
    }
  })
}
