export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST allowed" })
    }

    try {
        const body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body

        const { webinar_id, first_name, email } = body

        if (!webinar_id || !first_name || !email) {
            return res.status(400).json({
                error: "Missing fields",
            })
        }

        const apiKey = process.env.WEBINARJAM_API_KEY

        const response = await fetch(
            "https://api.webinarjam.com/webinarjam",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: apiKey,

                    // ACTION WAJIB (ini yang sering dilupakan)
                    method: "register",

                    webinar_id,
                    first_name,
                    email,
                }),
            }
        )

        const data = await response.json()

        return res.status(200).json(data)
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: "Server error",
        })
    }
}