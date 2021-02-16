/**
 * Server configuration
 * 
 * @author Pierre Hubert
 */

let _serverConfigCache = null;

class ServerConfig {
    
    static async ensureLoaded() {
        if (!_serverConfigCache)
            _serverConfigCache = await api("server/config");
    }

    /**
     * @returns {StaticServerConfig}
     */
    static get conf() {
        return _serverConfigCache;
    }
}