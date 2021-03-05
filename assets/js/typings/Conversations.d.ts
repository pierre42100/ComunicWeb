/**
 * Conversations typings
 * 
 * @author Pierre Hubert
 */

declare interface ConversationSettingsFormElements {
	rootElem: HTMLElement,
	usersElement: HTMLElement,
	conversationNameInput: HTMLElement,
	allowEveryoneToAddMembers: HTMLElement,
	followConversationInput: HTMLElement,
}

declare interface ConversationMember {
	user_id: number,
	last_message_seen: number,
	last_access: number,
	following: boolean,
	is_admin: boolean,
}

declare interface Conversation {
	id: number,
	last_activity: number,
	name: string,
	color?: string,
	logo?: string,
	group_id?: number,
	members: ConversationMember[],
	can_everyone_add_members: boolean,
	can_have_call: boolean,
	can_have_video_call: boolean,
	has_call_now: boolean,
}

declare interface ConversationServerMessage {
	type: "user_created_conv"|"user_added_another"|"user_left"|"user_removed_another",
	user_id?: number,
	user_who_added?: number,
	user_added?: number,
	user_who_removed?: number,
	user_removed?: number,
}

declare interface ConversationMessageFile {
	url: string,
	size: number,
	name: string,
	thumbnail?: string,
	type: string
}

declare interface ConversationMessage {
	id: number,
	conv_id: number,
	user_id: number,
	time_sent: number,
	message?: string,
	file?: ConversationMessageFile,
	server_message?: ConversationServerMessage,
}

declare interface UnreadConversation {
	conv: Conversation,
	message: ConversationMessage
}