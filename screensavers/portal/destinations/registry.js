/**
 * registry.js — Master list of portal destinations
 *
 * To add a new destination:
 *   1. Create screensavers/portal/destinations/your-era.js
 *   2. Add one import line below
 *   3. Add the imported module to the destinations array
 *
 * That's it. The engine picks up everything automatically.
 */

import unix1975    from './unix-1975.js';
import dos1985     from './dos-1985.js';
import amiga1985   from './amiga-1985.js';
import nextstep1989 from './nextstep-1989.js';
import beos1997    from './beos-1997.js';
import kde1999     from './kde1-1999.js';

export const destinations = [
  unix1975,
  dos1985,
  amiga1985,
  nextstep1989,
  beos1997,
  kde1999,
];
