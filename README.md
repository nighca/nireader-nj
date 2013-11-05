NIREADER
=========

My own reader.

build:

	$ npm install

	$ cd static/javascripts/ && spm build

	$ qrsync $QRSYNC_PATH/qrsync.json

	{
		"access_key": "...",
		"secret_key": "...",
		"bucket": "nireader",
		"sync_dir": "$NIREADER_PATH/static",
		"async_ops": "",
		"debug_level": 1
	}

	$ qboxrsctl refresh nireader

to run as development

	$ node server/nireader.js

to run as production

	$ NODE_ENV=production PORT=3000 node server/nireader.js