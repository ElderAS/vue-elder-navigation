import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp'

library.add(faTimes, faBars, faAngleDown, faAngleUp)
dom.watch()
