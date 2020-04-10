/**
 * Typescript typing rules for Utils
 * 
 * @author Pierre HUBERT
 */

declare interface CreateElem2Args {
	type : string,
	appendTo ?: HTMLElement,
	insertBefore ?: HTMLElement,
	insertAsFirstChild ?: HTMLElement,
	class ?: string,
	id ?: string,
	title ?: string,
	src ?: string,
	href ?: string,
	internalHref ?: string,
	name ?: string,
	elemType ?: string,
	value ?: string,
	placeholder ?: string,
	innerHTML ?: string,
	innerLang ?: string,
	innerHTMLprefix ?: string,
	disabled ?: boolean,
	children ?: HTMLElement[],
	onclick ?: Function,
	ondblclick ?: Function
}

declare function createElem(nodeType : string, appendTo : string) : HTMLElement;

declare function createElem2(infos : CreateElem2Args) : HTMLElement;

declare function byId(id : string) : HTMLElement;

declare function emptyElem(target : HTMLElement) : void;

declare function checkMail(emailAddress : string) : boolean;