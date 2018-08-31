import * as JsDiff from 'diff';

export type DiffGroup = JsDiff.IDiffResult[];

export function diffMarkdown(oldSource: string, newSource: string) {
  let diffs = JsDiff.diffLines(oldSource, newSource);

  let diffGroups: DiffGroup[] = [];

  let lastDiffObj: JsDiff.IDiffResult | undefined;
  let lastDiffGroup: DiffGroup = [];

  for (let diffObj of diffs) {
    if (diffObj.added || diffObj.removed) {
      if (!lastDiffObj || (!lastDiffObj.added && !lastDiffObj.removed)) {
        let group: DiffGroup = [];

        group.push(diffObj);

        diffGroups.push(group);

        lastDiffGroup = group;
      } else {
        lastDiffGroup.push(diffObj);
      }
    }

    lastDiffObj = diffObj;
  }

  return diffGroups;
}
