import config from '~/config/api';

const BASE_ENDPOINT = config.dev_base_endpoint;

const ThreadService = {

  async fetchThread(artefactId) {
    const url = `${BASE_ENDPOINT}/user/thread/${artefactId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to get a response from the '${url}' endpoint`);
      }

      // Response was ok
      return response.json();
    } catch (error) {
      console.error(error);
    }
  },

};

export default ThreadService;
