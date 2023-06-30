import {
    ConfigService,
    SelfRefreshingCache,
    SelfRefreshingCacheConfig,
    createSelfRefreshingCache,
} from '../..';

import { EntityCacheStrategy } from './entity-cache-strategy';

/**
 * @description
 * This is the default entity caching strategy based on {@link SelfRefreshingCache.}
 * The Vendure default is to use a the {@link InMemorySessionCacheStrategy}, which is fast and suitable for
 * single-instance deployments with limited amount of channels. However, for multi-instance deployments (horizontally scaled, serverless etc.),
 * or using deployment with large entity counts you will need to define a custom strategy that stores
 * the entity cache in a shared data store, such as Redis.
 *
 *
 * @docsCategory entities
 * @docsPage EntityCacheStrategy
 * @docsWeight 0
 */
export class EntityCacheSelfRefreshingStrategy implements EntityCacheStrategy {
    async createCache<V, RefreshArgs extends any[]>(
        configService: ConfigService,
        config: SelfRefreshingCacheConfig<V, RefreshArgs>,
        refreshArgs?: RefreshArgs,
    ): Promise<SelfRefreshingCache<V, RefreshArgs>> {
        const decoratedConfig = { ...config };
        switch (config.name) {
            case 'ChannelService.allChannels':
                decoratedConfig.ttl = configService.entityOptions.channelCacheTtl;
                break;
            case 'TaxRateService.activeTaxRates':
                decoratedConfig.ttl = configService.entityOptions.taxRateCacheTtl;
                break;
            case 'ZoneService.zones':
                decoratedConfig.ttl = configService.entityOptions.zoneCacheTtl;
                break;
        }

        return createSelfRefreshingCache(decoratedConfig, refreshArgs);
    }
}
