import { createJupiterApiClient } from '@jup-ag/api';

let jupApi = null;

export const createJupApiClient = () => {
    if(jupApi) return jupApi;
    jupApi = createJupiterApiClient();
    return jupApi;
}