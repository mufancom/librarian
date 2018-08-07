declare module 'simple-git' {
  function simpleGit(baseDir: string): simpleGit.Git;

  namespace simpleGit {
    type ThenCallback = (error?: any, data?: any) => void;
    type AnyCallback = (...args: any[]) => any;

    interface LogOptions {
      from: string;
      to: string;
      file: string;
    }

    class Git {
      customBinary: (command: string) => Git;
      env: (name: string | object, value: string) => Git;
      cwd: (workingDirectory: string, then: ThenCallback) => Git;
      outputHandler: (outputHandler: ThenCallback) => Git;
      init: (bare: boolean, then: ThenCallback) => void;
      status: (then: ThenCallback) => void;
      stashList: (options: object | any[]) => void;
      stash: (options: object | any[], then: ThenCallback) => void;
      clone: (
        repoPath: string,
        localPath: string,
        options: string[],
        then: ThenCallback,
      ) => void;
      mirror: (repoPath: string, localPath: string, then: ThenCallback) => void;
      mv: (from: string | string[], to: string, then: ThenCallback) => void;
      checkoutLatestTag: (then: ThenCallback) => void;
      add: (files: string | string[], then: ThenCallback) => void;
      commit: (
        message: string | string[],
        files: string | string[],
        options: object,
        then: ThenCallback,
      ) => void;
      pull: (
        remote: string,
        branch: string,
        options: object,
        then: ThenCallback,
      ) => void;
      fetch: (remote: string, branch: string, then: ThenCallback) => void;
      silent: (silence: boolean) => Git;
      tags: (options: object, then: ThenCallback) => void;
      rebase: (options: object | string[], then: ThenCallback) => void;
      reset: (mode: string | string[], then: ThenCallback) => void;
      revert: (commit: string, options: object, then: ThenCallback) => void;
      addTag: (name: string, then: ThenCallback) => void;
      addAnnotatedTag: (
        tagName: string,
        tagMessage: string,
        then: ThenCallback,
      ) => void;
      checkout: (what: string | string[], then: ThenCallback) => void;
      checkoutBranch: (
        branchName: string,
        startPoint: string,
        then: ThenCallback,
      ) => void;
      checkoutLocalBranch: (branchName: string, then?: ThenCallback) => void;
      deleteLocalBranch: (branchName: string, then?: ThenCallback) => void;
      branch: (options: string[], then?: ThenCallback) => void;
      branchLocal: (then?: ThenCallback) => void;
      addConfig: (key: string, value: string, then?: ThenCallback) => void;
      raw: (commands: string[] | object, then?: ThenCallback) => void;
      submoduleAdd: (repo: string, path: string, then?: ThenCallback) => void;
      submoduleUpdate: (args: string[], then?: ThenCallback) => void;
      submoduleInit: (args: string[], then?: ThenCallback) => void;
      subModule: (options: string[], then?: ThenCallback) => void;
      listRemote: (args: string[], then?: ThenCallback) => void;
      addRemote: (
        remoteName: string,
        remoteRepo: string,
        then: ThenCallback,
      ) => void;
      removeRemote: (remoteName: string, then?: ThenCallback) => void;
      gitRemotes: (verbose: boolean, then?: ThenCallback) => void;
      remote: (options: string[], then?: ThenCallback) => void;
      mergeFromTo: (
        from: string,
        to: string,
        options: string[],
        then: ThenCallback,
      ) => void;
      merge: (options: object | string[], then?: ThenCallback) => void;
      tag: (options: string[], then?: ThenCallback) => void;
      updateServerInfo: (then?: ThenCallback) => void;
      push: (
        remote: string | string[],
        branch: string,
        then?: ThenCallback,
      ) => void;
      pushTags: (remote: string, then?: ThenCallback) => void;
      rm: (files: string | string[], then?: ThenCallback) => void;
      rmKeepLocal: (files: string | string[], then?: ThenCallback) => void;
      catFile: (options: string[], then?: ThenCallback) => void;
      binaryCatFile: (options: string[], then?: ThenCallback) => void;
      diff: (options: string[], then?: ThenCallback) => void;
      diffSummary: (options: string[], then?: ThenCallback) => void;
      revparse: (options: string | string[], then: ThenCallback) => void;
      show: (options: string[], then: ThenCallback) => void;
      clean: (mode: string, options: string[], then: ThenCallback) => void;
      exec: (then: ThenCallback) => void;
      then: (then: ThenCallback) => void;
      log: (options: LogOptions | string[], then: ThenCallback) => void;
      clearQueue: () => Git;
      checkIgnore: (pathnames: string | string[], then: ThenCallback) => void;
      checkIsRepo: (then: ThenCallback) => void;

      constructor(baseDir: string, ChildProcess: object, Buffer: AnyCallback);
    }
  }

  export = simpleGit;
}
