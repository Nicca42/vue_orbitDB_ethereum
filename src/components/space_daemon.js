import { SpaceClient } from '@fleekhq/space-client';

// default port exposed by the daemon for client connection is 9998
const client = new SpaceClient({
  url: `http://0.0.0.0:9998`,
});