const changelogModule = require("@changesets/cli/changelog");
const defaultChangelog = changelogModule.default ?? changelogModule;

module.exports = {
  ...defaultChangelog,
  getDependencyReleaseLine(changesets, dependenciesUpdated, options) {
    // Squash merge된 changeset들이 같은 의존성 갱신 문구를 반복하지 않도록 합니다.
    const seenCommits = new Set();
    const uniqueChangesets = changesets.filter(({ commit }) => {
      const key = commit || "";
      if (seenCommits.has(key)) return false;
      seenCommits.add(key);
      return true;
    });

    return defaultChangelog.getDependencyReleaseLine(
      uniqueChangesets,
      dependenciesUpdated,
      options,
    );
  },
};
