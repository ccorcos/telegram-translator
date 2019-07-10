import { Request, Response } from "express"
import { Translate } from "@google-cloud/translate"

/**
 * The name of this export must match the `--entry-point` option in
 * the deploy script.
 */
export default async function main(req: Request, res: Response) {
	const translate = new Translate()
	const text = "Привет, мир"
	const target = "en"

	console.log(req)

	// Translates some text into Russian
	const [translation] = await translate.translate(text, target)
	console.log(`Text: ${text}`)
	console.log(`Translation: ${translation}`)

	res.status(200).send(translation)
}
