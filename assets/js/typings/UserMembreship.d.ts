/**
 * User membreship typings
 * 
 * @author Pierre Hubert
 */

declare interface UserMembership {
    type: "group"|"friend"|"conversation",
    id ?: number,
    friend ?: Friend,
    last_activity ?: number,
    conv ?: Conversation 
}