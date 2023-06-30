import { ID } from '@vendure/common/lib/shared-types';

import { ConfigService } from '..';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
export interface EntityCache<V, RefreshArgs extends any[] = []> {
    /**
     * @description
     * The current value of the cache. If the value is stale, the data will be refreshed and then
     * the fresh value will be returned.
     */
    value(...refreshArgs: RefreshArgs | [undefined] | []): Promise<V>;

    /**
     * @description
     * Allows a memoized function to be defined. For the given arguments, the `fn` function will
     * be invoked only once and its output cached and returned.
     * The results cache is cleared along with the rest of the cache according to the configured
     * `ttl` value.
     */
    memoize<Args extends any[], R>(
        args: Args,
        refreshArgs: RefreshArgs,
        fn: (value: V, ...args: Args) => R,
    ): Promise<R>;

    /**
     * @description
     * Force a refresh of the value, e.g. when it is known that the value has changed such as after
     * an update operation to the source data in the database.
     */
    refresh(...args: RefreshArgs): Promise<V>;
}

export interface EntityCacheConfig<V, RefreshArgs extends any[]> {
    name: string;
    refresh: {
        fn: (...args: RefreshArgs) => Promise<V>;
        /**
         * Default arguments, passed to refresh function
         */
        defaultArgs: RefreshArgs;
    };
    /**
     * Intended for unit testing the SelfRefreshingCache only.
     * By default uses `() => new Date().getTime()`
     */
    getTimeFn?: () => number;
}

export interface EntityCacheStrategy extends InjectableStrategy {
    /**
     * @description
     * Store the session in the cache. When caching a session, the data
     * should not be modified apart from performing any transforms needed to
     * get it into a state to be stored, e.g. JSON.stringify().
     */

    createCache<V, RefreshArgs extends any[]>(
        configService: ConfigService,
        config: EntityCacheConfig<V, RefreshArgs>,
        refreshArgs?: RefreshArgs,
    ): Promise<EntityCache<V, RefreshArgs>>;
}
