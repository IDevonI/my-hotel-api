import { init } from "@paralleldrive/cuid2";
import { config } from '../config';

export const getCUID = init({
    random: Math.random,
    length: config.cuid.length,
    fingerprint: config.cuid.fingerprint
})