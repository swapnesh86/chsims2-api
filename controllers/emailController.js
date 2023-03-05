const asyncHandler = require('express-async-handler')
const sendEmail = require("../utils/sendEmail");

const createNewEmail = asyncHandler(async (req, res) => {
    const { recipient, subject, messagebody } = req.body

    const style = `<head><style>
		table {
			border: 1px solid black;
			font-size:12px;
			width:100%;
		}
    </style>
    </head>`
    const head = `<thead className="table__row bill--searchrow">
                    <tr>
                        <th style="background-color: lightblue;border-bottom: solid 1px black;border-right: solid 1px black">Barcode</th>
                        <th style="background-color: lightblue;border-bottom: solid 1px black;border-right: solid 1px black">Name</th>
                        <th style="background-color: lightblue;border-bottom: solid 1px black;border-right: solid 1px black">Mrp</th>
                        <th style="background-color: lightblue;border-bottom: solid 1px black;border-right: solid 1px black">Qty</th>
                    </tr>
                </thead>`
    let line = ''
    for (let i = 0; i < messagebody.length; i++) {
        line = line + `<tr className="table__row bill--row" >
            <td style="border-right: solid 1px black">${messagebody[i].barcode}</td>
            <td style="border-right: solid 1px black">${messagebody[i].name}</td>
            <td style="text-align:center;border-right: solid 1px black">${messagebody[i].qty}</td>
            <td style="text-align:center;border-right: solid 1px black">${messagebody[i].mrp}</td>
        </tr>`
        //line = line + `<tr><td>${messagebody[i].barcode}</td><td>${messagebody[i].name}</td><td>${messagebody[i].mrp}</td><td>${messagebody[i].qty}</td></tr>`
    }
    const message = `${style}<table>${head}<tbody>${line}</tbody></table>`

    //Confirm Data
    if (!recipient || !subject || !message) {
        return res.status(400).json({ message: `Failed with messagebody: ${messagebody}` })
    }

    const sent_from = process.env.EMAIL_USER;
    const reply_to = recipient;
    //Create and store new email
    const email = await sendEmail(subject, message, recipient, sent_from, reply_to);

    if (email) {
        res.status(200).json({ success: true, message: `New email sent to ${recipient}` })
    } else {
        res.status(500).json({ message: 'Send Failed' })
    }

})

module.exports = {
    createNewEmail
}