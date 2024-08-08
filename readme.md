# The <a href './utils/sessionCache.js'>_sessionCache_</a>

The session cache is just a temporary solution as it does not work well with large data.
Also the application uses the _express-session_ packsge which uses the default session store,
the _memory store_, so the <a href './utils/sessionCache.js'>_sessionCache_</a> uses the _memory store_
also, which means it gets cleared everytime the server restarts.
