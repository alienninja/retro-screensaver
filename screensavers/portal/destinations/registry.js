/**
 * registry.js — Master list of portal destinations
 *
 * Ordered chronologically. The engine picks randomly so order doesn't matter
 * for gameplay, but it helps to see the full OS timeline at a glance.
 *
 * To add a new destination:
 *   1. Create screensavers/portal/destinations/your-os.js
 *   2. Import it below
 *   3. Add it to the destinations array
 */

import xerox1973    from './xerox-1973.js';
import unix1975     from './unix-1975.js';
import apple21979   from './apple2-1979.js';
import mac1984      from './mac-1984.js';
import dos1985      from './dos-1985.js';
import amiga1985    from './amiga-1985.js';
import nextstep1989 from './nextstep-1989.js';
import win95_1995   from './win95-1995.js';
import beos1997     from './beos-1997.js';
import kde1999      from './kde1-1999.js';
import osx2001      from './osx-2001.js';

export const destinations = [
  xerox1973,
  unix1975,
  apple21979,
  mac1984,
  dos1985,
  amiga1985,
  nextstep1989,
  win95_1995,
  beos1997,
  kde1999,
  osx2001,
];
