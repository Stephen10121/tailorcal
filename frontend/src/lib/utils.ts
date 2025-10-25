import { clsx, type ClassValue } from "clsx";
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