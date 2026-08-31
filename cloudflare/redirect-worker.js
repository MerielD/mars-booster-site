const CANONICAL_HOST = 'www.marsbooster.net';
const PAGES_ORIGIN = 'marsbooster.pages.dev';

const redirectWorker = {
  fetch(request) {
    const destination = new URL(request.url);

    if (destination.hostname === CANONICAL_HOST) {
      destination.hostname = PAGES_ORIGIN;
      return fetch(new Request(destination, request));
    }

    destination.protocol = 'https:';
    destination.hostname = CANONICAL_HOST;
    destination.port = '';

    return Response.redirect(destination.toString(), 301);
  },
};

export default redirectWorker;
