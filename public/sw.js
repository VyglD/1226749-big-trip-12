const CACHE_PREFIX = `bigtrip-cache`;
const CACHE_VER = `v12.3`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = `basic`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/js/bundle.js`,
            `/css/style.css`,
            `img/header-bg.png`,
            `img/header-bg@2x.png`,
            `img/logo.png`,
            `img/photos/1.jpg`,
            `img/photos/2.jpg`,
            `img/photos/3.jpg`,
            `img/photos/4.jpg`,
            `img/photos/5.jpg`,
            `img/icons/bus.png`,
            `img/icons/check-in.png`,
            `img/icons/drive.png`,
            `img/icons/flight.png`,
            `img/icons/restaurant.png`,
            `img/icons/ship.png`,
            `img/icons/sightseeing.png`,
            `img/icons/taxi.png`,
            `img/icons/train.png`,
            `img/icons/transport.png`,
            `https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,800&display=swap`,
            `https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gnD_g.woff2`,
            `https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_bZF3gnD_g.woff2`,
            `https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_ZpC3gnD_g.woff2`,
            `https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_c5H3gnD_g.woff2`,
            `https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2`
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then(
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      return null;
                    })
                  .filter((key) => key !== null)
            )
        )
  );
});

const handleFetch = (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }

          return fetch(request)
            .then((response) => {
              if (!response
                || response.status !== HTTP_STATUS_OK
                || response.type !== RESPONSE_SAFE_TYPE
              ) {
                return response;
              }

              const clonedResponse = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, clonedResponse));

              return response;
            });
        })
  );
};

self.addEventListener(`fetch`, handleFetch);
