// import { RateLimiterMemory, RateLimiterRedis, RateLimiterRes} from 'rate-limiter-flexible';
// import type { IRateLimiterOptions, IRateLimiterStoreOptions, RateLimiterAbstract} from 'rate-limiter-flexible';
// import env from './utils/env';

// type IRateLimiterOptionsOveerrides = Partial<IRateLimiterOptions> | Partial<IRateLimiterStoreOptions>;

// export function createRateLimiter(
//     configPrefix = "RATE_LIMITER",
//     configOverrides?: IRateLimiterOptionsOveerrides
// ): RateLimiterAbstract{

//     switch(env['RATE_LIMITER_STORE']){
//         case 'redis':
//             return new RateLimiterRedis();
//         case 'memory':
//             break;
//         default:
//             return '';

//     }
// }