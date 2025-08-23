/**
 * Format: { "https://to1": "/from1", "https://to2": ["/from2", ...], ... }
 */
exports.redirects = {
  // Pv's Open Door Hours
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3y01KHMdoAfv975kH3oc5oAw2EV7Db5vNF1lKcnLMQ4eqWjx4DO0Edk3_rP2lrmulrEnji8mpK": [
    "/pv/meeting",
    "/pv/meet",
    "/meeting",
    "/meet",
  ],
  // Pv's Calendar
  "https://calendar.google.com/calendar/u/0?cid=cGF1bC5wZWF2eWhvdXNlQGdtYWlsLmNvbQ": [
    "/pv/calendar",
    "/calendar",
    "/pv/cal",
    "/cal",
  ],
  // resume
  "https://swooby.com/pv/resume": [
    "/pv/resume",
    "/resume",
    "/pv/cv",
    "/pvcv",
    "/pv/r",
    "/pvr",
    "/cv",
    "/r",
  ],
  // resume: code
  "https://github.com/paulpv/resume/blob/main/src/App.tsx": [
    "/pv/resume/code",
    "/resume/code",
    "/pv/cv/code",
    "/pvcv/code",
    "/pv/r/code",
    "/cv/code",
    "/r/code",
  ],
  // resume: yaml | data
  "https://swooby.com/pv/resume/resume.yaml": [
    "/pv/resume.yaml",
    "/pv/resume/yaml",
    "/resume.yaml",
    "/resume/yaml",
    "/pv/cv.yaml",
    "/pv/cv/yaml",
    "/pv/r.yaml",
    "/pv/r/yaml",
    "/pvcv.yaml",
    "/pvcv/yaml",
    "/cv.yaml",
    "/cv/yaml",
    "/r.yaml",
    "/r/yaml",
    "/pv/resume/data",
    "/resume/data",
    "/pv/cv/data",
    "/pvcv/data",
    "/pv/r/data",
    "/cv/data",
    "/r/data",
  ],
  // resume: json (deprecated)
  "https://swooby.com/pv/resume/resume.json": [
    "/pv/resume.json",
    "/pv/resume/json",
    "/resume.json",
    "/resume/json",
    "/pv/cv.json",
    "/pv/cv/json",
    "/pv/r.json",
    "/pv/r/json",
    "/pvcv.json",
    "/pvcv/json",
    "/cv.json",
    "/cv/json",
    "/r.json",
    "/r/json",
  ],
  // resume: readme
  "https://github.com/paulpv/resume/blob/main/README.md": [
    "/pv/resume/readme",
    "/resume/readme",
    "/pv/cv/readme",
    "/pvcv/readme",
    "/cv/readme",
    "/r/readme",
  ],
  // resume: issues
  "https://github.com/paulpv/resume/issues": [
    "/pv/resume/issues",
    "/resume/issues",
    "/pv/cv/issues",
    "/pvcv/issues",
    "/cv/issues",
    "/r/issues",
  ],
  // resume: pv LinkedIn
  "https://linkedin.com/in/paulpv": [
    "/pv/linkedin",
    "/pv/li",
  ],
  // resume: pv GitHub
  "https://github.com/paulpv": [
    "/pv/github",
    "/pv/gh",
  ],
  // resume: pv StackOverflow
  "https://stackoverflow.com/users/252308/swooby": [
    "/pv/stackoverflow",
    "/pv/so",
  ],
  // resume: Promethean, Inc. ActivPanel 9 Pro
  "https://www.prometheanworld.com/products/interactive-displays/activpanel-9-pro/": [
    "/prom/ap9pro",
    "/prom-ap9pro",
  ],
  // resume: Promethean, Inc. ActivPanel 9
  "https://www.prometheanworld.com/products/interactive-displays/activpanel-9/": [
    "/prom/ap9",
    "/prom-ap9",
  ],
  // resume: Pebblebee Finder for Android
  "https://play.google.com/store/apps/details?id=com.pebblebee.app.hive3": [
    "/pb/afinder",
    "/pb-afinder",
  ],
  // resume: Pebblebee Stone for Android
  "https://play.google.com/store/apps/details?id=com.pebblebee.app.hive": [
    "/pb/astone",
    "/pb-astone",
  ],
  // resume: Pebblebee App for iPhone
  "https://apps.apple.com/us/app/pebblebee-app/id1052309602": [
    "/pb/ifinder",
    "/pb-ifinder",
  ],
  // resume: WAVE Mobile Communicator for Android
  "https://play.google.com/store/apps/details?id=com.motorolasolutions.wave512": [
    "/msi/awave",
    "/msi-awave",
  ],
  // resume: WAVE Mobile Communicator for iPhone
  "https://apps.apple.com/us/app/wave-mobile-communicator/id1172021005": [
    "/msi/iwave",
    "/msi-iwave",
  ],
  // resume: WAVE Mobile Comm PTT (5.11) for Android
  "https://play.google.com/store/apps/details?id=com.motorolasolutions.wave": [
    "/msi/awave511",
    "/msi-awave511",
  ],
  // resume: WAVE Mobile Communicator PTT (5.11) for iPhone
  "https://apps.apple.com/us/app/wave-mobile-communicator-ptt-5-11/id1041037431": [
    "/msi/iwave511",
    "/msi-iwave511",
  ],
  // resume: WAVE Communicator
  "https://web.archive.org/web/20110717115955/http://www.twistpair.com/index/products": [
    "/tps/wave",
    "/tps-wave",
  ],
  // resume: Microsoft Office RoundTable
  "https://en.wikipedia.org/wiki/Microsoft_RoundTable": [
    "/ms/roundtable",
    "/ms-roundtable",
  ],
  // resume: Microsoft Office Live Communications Server
  "https://en.wikipedia.org/wiki/Microsoft_Office_Live_Communications_Server": [
    "/ms/olcs",
    "/ms-olcs",
  ],
  // resume: Microsoft Office Live Meeting
  "https://en.wikipedia.org/wiki/Microsoft_Office_Live_Meeting": [
    "/ms/ocs",
    "/ms-ocs",
  ],
  // resume: Microsoft Exchange Server 2003 (Titanium)
  "https://en.wikipedia.org/wiki/History_of_Microsoft_Exchange_Server#Exchange_Server_2003": [
    "/ms/ecs2k3",
    "/ms-ecs2k3",
  ],
  // resume: Microsoft Exchange Server 2000 (Platinum)
  "https://en.wikipedia.org/wiki/History_of_Microsoft_Exchange_Server#Exchange_2000_Server": [
    "/ms/ecs2k",
    "/ms-ecs2k",
  ],
  // resume: FleetVieweR YouTube Playlist
  "https://youtube.com/playlist?list=PL3ihp3M7tg74AXCRisosSnT5qb1taoiCx": [
    "/fleetviewr/youtube",
  ],
  // resume: Swooby TinyPICO PCBs
  "https://github.com/swooby/pcb/tree/master/TinyPICO": [
    "/pcb/tp",
  ],
  // resume: Using AJAX to Enable Client RPC Requests
  "https://web.archive.org/web/20120225132702/http://code.google.com/appengine/articles/rpc.html": [
    "/pub/ajax",
  ],
  // resume: CarPC Hacks
  "https://www.oreilly.com/library/view/car-pc-hacks/0596008716/": [
    "/pub/carpc",
  ],
  // resume: Patent WO2013154722 PULSED INPUT PUSH-TO-TALK ...
  "https://worldwide.espacenet.com/publicationDetails/biblio?FT=D&CC=WO&NR=2013154722A1": [
    "/WO2013154722",
  ],
  // resume: Patent WO2013116741 TIP-RING-RING-SLEEVE PUSH-TO-TALK ...
  "https://worldwide.espacenet.com/publicationDetails/biblio?FT=D&CC=WO&NR=2013116741A1": [
    "/WO2013116741",
  ],
  // resume: References
  "https://www.linkedin.com/in/paulpv/details/recommendations/": [
    "/pv/references",
    "/pv/refs",
  ],
};
