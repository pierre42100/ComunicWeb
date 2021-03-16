/**
 * Group typings
 * 
 * @author Pierre Hubert
 */

declare interface AdvancedGroupInfo extends Group {
    time_create: Number,
    description: String,
    url: String,
    number_likes: Number,
    is_liking: Boolean
}

declare interface GroupSettings extends AdvancedGroupInfo {}