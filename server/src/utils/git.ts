import simpleGit = require('simple-git/promise/index');

import {CONVENTION_GIT_BASE_PATH} from 'paths';

export const Git = simpleGit(CONVENTION_GIT_BASE_PATH);
