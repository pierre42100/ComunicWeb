/**
 * Settings interface
 * 
 * @author Pierre Hubert
 */

declare interface DataConservationPolicy {
    inactive_account_lifetime?: number,
    notification_lifetime?: number,
    comments_lifetime?: number,
    posts_lifetime?: number,
    conversation_messages_lifetime?: number,
    likes_lifetime?: number
}