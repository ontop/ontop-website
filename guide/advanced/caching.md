# HTTP caching
*Since 4.1.0.*

HTTP caching allows to reduce the load on the SPARQL endpoint and to provide faster responses to clients. 
It is particularly useful when many clients issue the same queries and data is not updated at a high frequency.

To enable HTTP caching, add the property `ontop.http.cacheControl` in the properties file.
This will cause the insertion of a [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) HTTP header in successful responses, with the specified value.

::: tip Example 
```properties
ontop.http.cacheControl=max-age=60, stale-while-revalidate=20, stale-if-error=300
```
This entry informs the cache that values can be considered as fresh for 60 seconds. After this period, the cache remains allowed to serve cached results for 20 more seconds while revalidating the requests in the background, or for 300 more seconds in case of error with the upstream server. 
:::

Ontop does not embed a HTTP cache. We recommend setting up a HTTP cache like [Varnish](https://varnish-cache.org/) or [Nginx](http://nginx.org) above the Ontop endpoint.

## Remarks

- Most caches (e.g. Nginx but also Web browsers) do not cache POST requests by default. Since most SPARQL queries are sent with the POST method, it is important to turn this option on. This option is safe as Ontop is a read-only system.
- Consider using the GET method for sending SPARQL queries so as to take advantage from Web browser caches.
- For an example of configuration for Nginx, see [this file](https://github.com/noi-techpark/it.bz.opendatahub.sparql/blob/eda53616c252691a73a8eb87963664cd06ca3e93/infrastructure/docker/nginx/default.conf).