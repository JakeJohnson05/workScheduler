const express = require(`express`);
const APP = express();
const FAVICON = require(`serve-favicon`);
const PORT = process.env.PORT || 5000;

APP.use(express.static(`appExpressScheduler`));

APP.use(FAVICON(`${ __dirname }/appExpressScheduler/favicon.ico`));
APP.use(FAVICON(`${ __dirname }/appExpressScheduler/favicon_2.ico`));
APP.use(FAVICON(`${ __dirname }/appExpressScheduler/favicon_3.ico`));

APP.get(`/`, (req, res) => res.sendFile(`startWorkScheduler.html`, {root: __dirname+`/appExpressScheduler`}));

APP.listen(PORT, () => console.log(`expressScheduler active on port ${ PORT }`));