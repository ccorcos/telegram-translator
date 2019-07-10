import { Request, Response } from "express"
import * as got from "got"
import { Translate } from "@google-cloud/translate"

/**
 * The name of this export must match the `--entry-point` option in
 * the deploy script.
 */
export default async function main(req: Request, res: Response) {
	const update: TelegramUpdate = JSON.parse(req.body)
	try {
		await handleTelegramMessage(update.message)
		res.status(200).send("Thank you!")
	} catch (error) {
		res.status(400).send("Error")
	}
}

export interface TelegramMessage {
	message_id: number
	from: {
		id: number
		is_bot: false
		first_name: string
		language_code: string // "en"
	}
	chat: {
		id: number
		first_name: string
		type: string // "private"
	}
	date: number

	// Basic message has text.
	text?: string
	entities?: Array<{
		offset: number
		length: number
		type: string // "bold"
	}>

	// A photo can have captions.
	photo?: Array<{
		file_id: string
		file_size: number
		width: number
		height: number
	}>
	caption?: string
	caption_entities?: Array<{
		offset: number
		length: number
		type: string // "url"
	}>

	// Message can be forwarded as well.
	forward_from_chat?: {
		id: number
		title: string
		username: string
		type: string // "channel"
	}
	forward_from_message_id?: number
	forward_date?: number
}

export interface TelegramUpdate {
	update_id: number
	message: TelegramMessage
}

/** Translates Russian -> English. */
async function translate(russian: string) {
	const translate = new Translate()
	const [translation] = await translate.translate(russian, "en")
	return translation
}

/** Handle translating and responding to Telegram messages. */
export async function handleTelegramMessage(message: TelegramMessage) {
	if (message.text) {
		await sendTelegramMessage({
			chat_id: message.chat.id,
			text: await translate(message.text),
			reply_to_message_id: message.message_id,
		})
	} else if (message.caption) {
		await sendTelegramMessage({
			chat_id: message.chat.id,
			text: await translate(message.caption),
			reply_to_message_id: message.message_id,
		})
	}
}

export const telegramApi = `https://api.telegram.org/bot${
	process.env.TELEGRAM_TOKEN
}`

interface SendMessageArgs {
	chat_id: number
	text: string
	reply_to_message_id?: number
}

/** Send a message to Telegram. */
async function sendTelegramMessage(args: SendMessageArgs) {
	await got.post(telegramApi + "/sendMessage", {
		json: true,
		body: args,
	})
}
