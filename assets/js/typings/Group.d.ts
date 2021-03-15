/**
 * Group typings
 * 
 * @author Pierre Hubert
 */

declare interface Group {
    id: Number,
    name: String,
    icon_url: String,
    number_members: Number,
    visibility: "open"|"private"|"secrete",
    registration_level: "open"|"moderated"|"closed",
    posts_level: "moderators"|"members",
    virtual_directory: String,
    membership: "administrator"|"moderator"|"member"|"invited"|"pending"|"visitor",
    following: Boolean,
}

declare interface AdvancedGroupInfo extends Group {
    time_create: Number,
    description: String,
    url: String,
    number_likes: Number,
    is_liking: Boolean
}

declare interface GroupSettings extends AdvancedGroupInfo {}