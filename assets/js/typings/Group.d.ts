/**
 * Group typings
 * 
 * @author Pierre Hubert
 */

declare interface AdvancedGroupInfo extends Group {
    is_members_list_public: Boolean,
    time_create: Number,
    description: String,
    url: String,
    number_likes: Number,
    is_liking: Boolean,
    conversations: Conversation[],
    is_forez_group: boolean,
}

declare interface GroupSettings extends AdvancedGroupInfo {}