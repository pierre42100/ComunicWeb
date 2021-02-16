/**
 * Server configuration typings
 * 
 * @author Pierre Hubert
 */

declare interface DataConservationPolicySettings {
    min_inactive_account_lifetime: number,
    min_notification_lifetime: number,
    min_comments_lifetime: number,
    min_posts_lifetime: number,
    min_conversation_messages_lifetime: number,
    min_likes_lifetime: number0
}

declare interface StaticServerConfig {
    data_conservation_policy: DataConservationPolicySettings;
}