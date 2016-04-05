# Gofer Retry

Gofer Retry simply adds the capability to use [retry](https://github.com/tim-kos/node-retry). It extends [Gofer](https://github.com/groupon/gofer).

# Caveat

Currently by utilizing the retry capability you do not get a return value of the `request` object
due to the fact that it may not be that one instance, depending on your retry configuration. You'll
have to stick with the callbacks and use of `Gofer`'s `Hub`.

# Install

```sh
npm install --save gofer-retry
```

# Usage

It adds a `retry` method to the class that you may call from within your endpoint handler.

Its configuration is what a `retry` `operation` expects. See the `retry` docs for more info.

See [examples](examples/)
