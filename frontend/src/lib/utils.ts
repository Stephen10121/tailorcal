import { clsx, type ClassValue } from "clsx";
import type { RecordModel } from "pocketbase";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * This function get the url that is passed and makes a fetch request to recieve the file. The function then returns the file in a blob format.
 * @param fileLink 
 * @returns Blob
 */
export async function fetchFileFromURL(fileLink: string): Promise<{error: false, blob: Blob} | {error: true, msg: unknown}> {
	try {
		const res = await fetch(fileLink);
		const blob = await res.blob();
		return {
			error: false,
			blob
		}
	} catch (err) {
		return {
			error: true,
			msg: err
		}
	}
}

// Don't judge
export function clearFileInput(ctrl: HTMLElement | null) {
	if (ctrl === null) return
	try {
		//@ts-ignore
		ctrl.value = null;
		//@ts-ignore
		if (ctrl.value) {
			//@ts-ignore
			ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl); 
		} 
		} catch(ex) {
	}
}

export const LONGDAYTOSTRING = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAYTOSTRING = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHTOSTRING = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function dateRangeOverlaps(a_start: Date, a_end: Date, b_start: Date, b_end: Date) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
    if (b_start <  a_start && a_end   <  b_end) return true; // a in b
    return false;
}

export type EventTimesType = {
	name: string,
	startTime: string,
	endTime: string
}

export type EventResourcesType = {
	id: string,
	kind: string,
	name: string,
	path_name: string
}

export type EventTagsType = {
	id: string,
	color: string,
	name: string
}

export interface EventDBModel extends RecordModel {
	name: string,
	location: string,
	times: EventTimesType[] | null,
	resources: EventResourcesType[] | null
	tags: EventTagsType[] | null,
	startTime: Date,
	endTime: Date,
}

export interface EventDBModelPrivate extends EventDBModel {
	owner: string
}

export interface CalendarDBModel extends RecordModel {
	name: string,
	password: string,
	passwordEnabled: boolean,
	owner: string,
	logo: string,
	visits: number,
	filters: unknown,
	description: string,
	passwordScreenMessage: string,
	displaySettings: CalendarCustomizations,
}

// Dont you dare judge
export function toggleFullScreen() {
	const elem = document.documentElement
	// ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
	//@ts-ignore
	if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
		//@ts-ignore
		if (elem.requestFullScreen) {
			//@ts-ignore
			elem.requestFullScreen();
			//@ts-ignore
		} else if (elem.mozRequestFullScreen) {
			//@ts-ignore
			elem.mozRequestFullScreen();//@ts-ignore
		} else if (elem.webkitRequestFullScreen) {//@ts-ignore
			elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);//@ts-ignore
		} else if (elem.msRequestFullscreen) {//@ts-ignore
			elem.msRequestFullscreen();//@ts-ignore
		}
	} else {//@ts-ignore
		if (document.cancelFullScreen) {//@ts-ignore
			document.cancelFullScreen();//@ts-ignore
		} else if (document.mozCancelFullScreen) {//@ts-ignore
			document.mozCancelFullScreen();//@ts-ignore
		} else if (document.webkitCancelFullScreen) {//@ts-ignore
			document.webkitCancelFullScreen();//@ts-ignore
		} else if (document.msExitFullscreen) {//@ts-ignore
			document.msExitFullscreen();
		}
	}
}

export type CalendarCustomizations = {
	useAMPM: boolean,
    showResourcePathname: boolean,
	onlyShowLocationTitle: boolean,
	showLocation: boolean,
	showResources: boolean,
	showRooms: boolean
}