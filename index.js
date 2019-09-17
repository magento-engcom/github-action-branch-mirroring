const core = require('@actions/core');
const github = require('@actions/github');
const { Toolkit } = require('actions-toolkit');
const tools = new Toolkit();

try {
    const branchMapping = JSON.parse(core.getInput('branch_matrix'));
    const payload = github.context.payload;

    if (!branchMapping.hasOwnProperty(payload.ref)) {
        core.setOutput("status", "No mirroring action configured for " + payload.ref);
        return;
    }

    tools.github.git.updateRef({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: branchMapping[payload.ref],
        sha: payload.after,
        force: true
    }).then(() => {
        core.setOutput("status", "Mirroring from " + payload.ref + " to " + branchMapping[payload.ref] + " completed");
    }, (error) => {
        core.setFailed(error.message + " " + github.context.repo.owner + " " + github.context.repo.repo + " " + branchMapping[payload.ref] + " " + payload.after);
    });

} catch (error) {
    core.setFailed(error.message);
}
