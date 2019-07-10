import * as got from "got"
import * as fs from "fs"
import { telegramApi, handleTelegramMessage } from "../src/main"

/**
 * Get the latest updates from the Telegram channel.
 * NOTE: you will have to disable the webhook for t
 */
async function getTelegramUpdates() {
	const response = await got.get(telegramApi + "/getUpdates", { json: true })
	return response.body
}

async function test() {
	const data = await getTelegramUpdates()
	for (const update of data.results) {
		await handleTelegramMessage(update.message)
	}
}

test()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
