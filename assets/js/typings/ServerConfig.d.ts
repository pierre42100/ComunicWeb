/**
 * Server configuration typings
 * 
 * @author Pierre Hubert
 */

declare interface PasswordPolicy {
    allow_email_in_password: boolean,
    allow_name_in_password: boolean,
    min_password_length: number,
    min_number_upper_case_letters: number,
    min_number_lower_case_letters: number,
    min_number_digits: number,
    min_number_special_characters: number,
    min_categories_presence: number,
}

declare interface DataConservationPolicySettings {
    min_inactive_account_lifetime: number,
    min_notification_lifetime: number,
    min_comments_lifetime: number,
    min_posts_lifetime: number,
    min_conversation_messages_lifetime: number,
    min_likes_lifetime: number
}

declare interface ConversationPolicy {
    min_message_len: number,
    max_message_len: number,
    allowed_files_type: String[],
    files_max_size: number,
    writing_event_interval: number,
    writing_event_lifetime: number,
}

declare interface AccountInformationPolicy {
    min_first_name_length: number,
    max_first_name_length: number,
    min_last_name_length: number,
    max_last_name_length: number,
}

declare interface StaticServerConfig {
    terms_url: string,
    privacy_policy_url: string,
    play_store_url: string,
    android_direct_download_url: string,
    password_policy: PasswordPolicy,
    data_conservation_policy: DataConservationPolicySettings,
    conversations_policy: ConversationPolicy,
    account_info_policy: AccountInformationPolicy,
}